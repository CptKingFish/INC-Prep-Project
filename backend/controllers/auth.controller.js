const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");
const Cryptr = require("cryptr");
const authManager = require("../services/auth.service");
const config = require("../config/config");
const E = require("../errors");
const { DbOption } = require("../config/dbservice.enums");

exports.processLogin = async (req, res, next) => {
  console.log("processLogin running.");
  const cookies = req.signedCookies;

  console.log(`Cookie available at login: ${util.inspect(cookies)}`);
  // Get login credentials
  const { email, password } = req.body;
  let errors = [];
  // Validation
  if (password === "" || email === "") {
    // Check for empty inputs
    errors = [
      ...errors,
      new E.ParameterError({
        parameter: "Email or password",
        value: "Empty email or password",
        message: "Both email and password is required.",
      }),
    ];
    // Check if there are errors
    if (errors.length > 0) {
      const dataError = new E.DataError({ errors });
      console.log(util.inspect(dataError));
      return next(dataError);
    }
  }

  try {
    const results = await authManager.findUser({
      email,
      actionType: DbOption.FIND_ONE_USER_USING_EMAIL,
    });
    console.log(
      "Inspect result variable inside processLogin findUser\n",
      results
    );

    if (results) {
      if (results[0] == null) {
        // No such user
        return res
          .status(401)
          .json({ statusCode: 401, ok: true, message: "Login failed" });
      }
      if (bcrypt.compareSync(password, results[0].password) === true) {
        // Password match
        const cryptr = new Cryptr(config.cryptr_secret);
        const userId = results[0].user_id;
        const roleName = results[0].role_name;
        const encryptedUserData = cryptr.encrypt(`${userId}:${roleName}`);
        console.log(`Length of encryptedUserData : ${encryptedUserData}`);

        // Create access token
        const newAccessToken = jwt.sign(
          {
            encryptedUserData,
          },
          config.JWTAccessTokenKey,
          {
            expiresIn: "3m", // For testing
            // Counted by seconds so 86400 is equivalent to 1 day
          }
        );

        // Create refresh token
        const newRefreshToken = jwt.sign(
          {
            encryptedUserData,
          },
          config.JWTRefreshTokenKey,
          {
            expiresIn: "5m", // For testing
          }
        );
        const { refreshToken } = req.signedCookies;
        if (refreshToken) {
          const searchRefreshTokenResult = await authManager.findRefreshToken({
            userId,
            refreshToken,
            actionType:
              DbOption.FIND_ONE_REFRESH_TOKEN_USING_USERID_AND_REFRESH_TOKEN,
          });
          console.log(
            "Inspect result variable inside processLogin findRefreshToken\n",
            searchRefreshTokenResult
          );

          if (searchRefreshTokenResult.length === 0) {
            console.log(">>>Attempted refresh token reuse at login!");
            // Delete all the refresh token records which are linked to the respective user
            await authManager.deleteRefreshToken({
              userId,
              actionType: DbOption.DELETE_ALL_REFRESH_TOKENS,
            });
          } else {
            console.log(
              "The [searchRefreshTokenResult.length is not 0]>>>No reuse/stolen possibilities"
            );
            console.log(
              "Remove the existing found refresh token which belongs to the user now\n" +
                "Before giving the client-side the new refresh token and save the new RT in database"
            );
            await authManager.deleteRefreshToken({
              refreshToken,
              actionType: DbOption.DELETE_ONE_REFRESH_TOKEN,
            });
          }

          res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          });
        } // End of checking reuse or stolen scenario

        // Create a new record in the refresh_tokens table
        await authManager.addRefreshToken(userId, newRefreshToken);
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          signed: true,
          secure: true,
          sameSite: "none",
        });
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          signed: true,
          secure: true,
          sameSite: "none",
        });

        const jsonResult = {
          first_name: results[0].first_name,
          last_name: results[0].last_name,
          roleName,
          isAuthenticated: true,
        };

        return res.status(200).send({
          statusCode: 200,
          ok: true,
          message: "Login successful",
          data: jsonResult,
        });
      }
      // Password do not match
      return res
        .status(401)
        .send({ statusCode: 401, ok: false, message: "Login failed" });
      // End of passowrd comparison with the retrieved decoded password.
    }
  } catch (error) {
    return next(error);
  }
}; // End of processLogin

exports.processLogout = async (req, res, next) => {
  console.log("processLogout running.");
  const { accessToken, refreshToken } = req.signedCookies;
  console.log("Delete all the cookies first.");
  console.log(`accessToken : ${accessToken}`);
  console.log(`refreshToken: ${refreshToken}`);
  // Clear the two cookies
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  if (refreshToken) {
    try {
      // If refreshToken is found inside the cookies, find and delete the refresh token record in the database.
      const result = await authManager.deleteRefreshToken({
        refreshToken,
        actionType: DbOption.DELETE_ONE_REFRESH_TOKEN,
      });
      console.log(
        `Inspect [result] variable after calling 
            userService.deleteRefreshToken>>>`,
        result[0].affectedRows
      );
      return res.status(200).send({
        ok: true,
        message: "Completed the operation.",
        data: [],
      });
    } catch (error) {
      return next(error);
    }
  } else {
    // The refresh token cookie might have been removed by the handleRefreshToken handler method.
    // As a result this else block will be executed by the JavaScript engine.
    return res.status(200).send({
      ok: true,
      message: "logout successfully!",
    });
  }
}; // End of processLogout

exports.processRefreshToken = async (req, res) => {
  console.log("processRefreshToken running.");
  const cookies = req.signedCookies;
  console.log("Inspect cookies variable inside processRefreshToken\n", cookies);
  const cryptr = new Cryptr(config.cryptr_secret);
  if (!cookies?.refreshToken)
    return res.status(401).send({
      ok: false,
      message: "No refresh token found to process a new access token for you",
      data: [],
    });

  const { refreshToken } = cookies;
  console.log(
    "Inspect result variable inside refreshToken variable\n",
    refreshToken
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  const resultRows = await authManager.findUser({
    refreshToken,
    actionType: DbOption.FIND_ONE_USER_USING_REFRESH_TOKEN,
  });
  console.log(
    "Inspect result variable inside findUser using refresh token\n",
    resultRows
  );

  const foundUser = resultRows.length !== 0 ? resultRows[0] : null;
  console.log(
    `Searching for the user linked to the refresh token: Inspect [foundUser] `
  );
  console.log(foundUser);

  // Detected possible refresh token reuse!
  // Start with user is null
  if (foundUser == null) {
    // Then, see if there is an error occuring when the jwt.verify is used on the refresh token.
    try {
      const decoded = await jwt.verify(refreshToken, config.JWTRefreshTokenKey);
      console.log("Attempted possible refresh token reuse!");

      await authManager.deleteRefreshToken({
        userId: cryptr.decrypt(decoded.userId),
        actionType: DbOption.DELETE_ALL_REFRESH_TOKENS,
      });
      return res.status(401).send({
        ok: false,
        message:
          "Suspected refresh token reuse. You are using a refresh token which is no longer ",
        data: [],
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send({ ok: false, message: "", data: [] });
    } // End of catch block
  }

  // Refresh token exists in the database.
  try {
    const decoded = await jwt.verify(
      refreshToken,
      config.JWTRefreshTokenKey,
      // eslint-disable-next-line no-undef
      (options = { verify_signature: true })
    );

    // Create new access token
    const newAccessToken = jwt.sign(
      {
        encryptedUserData: decoded.encryptedUserData,
      },
      config.JWTAccessTokenKey,
      {
        expiresIn: "3m", // For testing
        // Counted by seconds so 86400 is equivalent to 1 day
      }
    );
    // Create new refresh token
    const newRefreshToken = jwt.sign(
      {
        encryptedUserData: decoded.encryptedUserData,
      },
      config.JWTRefreshTokenKey,
      {
        expiresIn: "5m", // For testing
      }
    );

    await authManager.addRefreshToken(foundUser.user_id, newRefreshToken);
    // Creates Secure Cookie with refresh token and access token
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      signed: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      signed: true,
      secure: true,
      sameSite: "none",
    });
    // Delete the refresh token which was used the the client to make a new set of
    // access token and refresh token.
    await authManager.deleteRefreshToken({
      refreshToken,
      actionType: DbOption.DELETE_ONE_REFRESH_TOKEN,
    });

    const jsonResult = {
      first_name: foundUser.first_name,
      last_name: foundUser.last_name,
      roleName: foundUser.role_name,
      isAuthenticated: true,
    };

    return res.status(200).send({
      statusCode: 200,
      ok: true,
      message: `You have successfully used your refresh token to ask for a new token.`,
      data: jsonResult,
    });
  } catch (error) {
    if (error?.message === "jwt expired") {
      console.log(
        "The refresh token has expired. No more refresh token rotation."
      );
      // If the refresh token has expired, delete the refresh token in the database.
      await authManager.deleteRefreshToken({
        refreshToken,
        actionType: DbOption.DELETE_ONE_REFRESH_TOKEN,
      });
      return res.status(401).send({
        ok: false,
        message: `Cannot help you generate a new token because your refresh token also rotten. Please login again.`,
      });
    }
    // Clear the two cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.status(401).send({ ok: false, message: "Forbidden" });
  }
}; // End of processRefreshToken

exports.processLoginStatus = async (req, res) => {
  console.log("processRefreshToken running.");
  const cookies = req.signedCookies;
  console.log("Inspect cookies variable inside processRefreshToken\n", cookies);
  const cryptr = new Cryptr(config.cryptr_secret);
  if (!cookies?.refreshToken)
    return res.status(401).send({
      ok: false,
      message: "No refresh token found to process a new access token for you",
      data: [],
    });

  const { refreshToken } = cookies;
  console.log(
    "Inspect result variable inside refreshToken variable\n",
    refreshToken
  );
  // res.clearCookie("refreshToken", {
  //   httpOnly: true,
  //   sameSite: "None",
  //   secure: true,
  // });

  const resultRows = await authManager.findUser({
    refreshToken,
    actionType: DbOption.FIND_ONE_USER_USING_REFRESH_TOKEN,
  });
  console.log(
    "Inspect result variable inside findUser using refresh token\n",
    resultRows
  );

  const foundUser = resultRows.length !== 0 ? resultRows[0] : null;
  console.log(
    `Searching for the user linked to the refresh token: Inspect [foundUser] `
  );
  console.log(foundUser);

  // Detected possible refresh token reuse!
  // Start with user is null
  if (foundUser == null) {
    // Then, see if there is an error occuring when the jwt.verify is used on the refresh token.
    try {
      const decoded = await jwt.verify(refreshToken, config.JWTRefreshTokenKey);
      console.log("Attempted possible refresh token reuse!");

      // await authManager.deleteRefreshToken({
      //   userId: cryptr.decrypt(decoded.userId),
      //   actionType: DbOption.DELETE_ALL_REFRESH_TOKENS,
      // });
      return res.status(401).send({
        ok: false,
        message:
          "Suspected refresh token reuse. You are using a refresh token which is no longer ",
        data: [],
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send({ ok: false, message: "", data: [] });
    } // End of catch block
  }

  // Refresh token exists in the database.
  try {
    const decoded = await jwt.verify(
      refreshToken,
      config.JWTRefreshTokenKey,
      // eslint-disable-next-line no-undef
      (options = { verify_signature: true })
    );

    // Create new access token
    // const newAccessToken = jwt.sign(
    //   {
    //     encryptedUserData: decoded.encryptedUserData,
    //   },
    //   config.JWTAccessTokenKey,
    //   {
    //     expiresIn: "3m", // For testing
    //     // Counted by seconds so 86400 is equivalent to 1 day
    //   }
    // );
    // // Create new refresh token
    // const newRefreshToken = jwt.sign(
    //   {
    //     encryptedUserData: decoded.encryptedUserData,
    //   },
    //   config.JWTRefreshTokenKey,
    //   {
    //     expiresIn: "5m", // For testing
    //   }
    // );

    // await authManager.addRefreshToken(foundUser.user_id, newRefreshToken);
    // Creates Secure Cookie with refresh token and access token
    // res.cookie("accessToken", newAccessToken, {
    //   httpOnly: true,
    //   signed: true,
    //   secure: true,
    //   sameSite: "none",
    // });
    // res.cookie("refreshToken", newRefreshToken, {
    //   httpOnly: true,
    //   signed: true,
    //   secure: true,
    //   sameSite: "none",
    // });
    // Delete the refresh token which was used the the client to make a new set of
    // access token and refresh token.
    // await authManager.deleteRefreshToken({
    //   refreshToken,
    //   actionType: DbOption.DELETE_ONE_REFRESH_TOKEN,
    // });

    const jsonResult = {
      first_name: foundUser.first_name,
      last_name: foundUser.last_name,
      roleName: foundUser.role_name,
      isAuthenticated: true,
    };

    return res.status(200).send({
      statusCode: 200,
      ok: true,
      message: `You have successfully used your refresh token to ask for a new token.`,
      data: jsonResult,
    });
  } catch (error) {
    if (error?.message === "jwt expired") {
      console.log(
        "The refresh token has expired. No more refresh token rotation."
      );
      // If the refresh token has expired, delete the refresh token in the database.
      // await authManager.deleteRefreshToken({
      //   refreshToken,
      //   actionType: DbOption.DELETE_ONE_REFRESH_TOKEN,
      // });
      return res.status(401).send({
        ok: false,
        message: `Cannot help you generate a new token because your refresh token also rotten. Please login again.`,
      });
    }
    // Clear the two cookies
    // res.clearCookie("accessToken", {
    //   httpOnly: true,
    //   sameSite: "None",
    //   secure: true,
    // });
    // res.clearCookie("refreshToken", {
    //   httpOnly: true,
    //   sameSite: "None",
    //   secure: true,
    // });
    return res.status(401).send({ ok: false, message: "Forbidden" });
  }
};
