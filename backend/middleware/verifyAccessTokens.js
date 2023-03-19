/* eslint-disable prefer-destructuring */
const jwt = require("jsonwebtoken");
const Cryptr = require("cryptr");
const config = require("../config/config");

exports.verifyToken = (req, res, next) => {
  console.log("verifyAccessToken method is called.");
  const { accessToken } = req.signedCookies; // get the cookie by key

  console.log("Inspect result variable inside accessToken\n", accessToken);
  try {
    const decoded = jwt.verify(accessToken, config.JWTAccessTokenKey);
    console.log(
      "Inspect result variable inside decoded variable content\n",
      JSON.stringify(decoded)
    );

    const cryptr = new Cryptr(config.cryptr_secret);
    const decryptedUserData = cryptr.decrypt(decoded.encryptedUserData);
    console.log("Inspect the decryptedUserData : ", decryptedUserData);

    req.body.userId = decryptedUserData.split(":")[0];
    req.body.roleName = decryptedUserData.split(":")[1];
    console.log("Decrypted user id in req.body.userId : ", req.body.userId);
    console.log("Decrypted roleId in req.body.roleName : ", req.body.roleName);
  } catch (error) {
    console.log(error.message);
    return res
      .status(403)
      .json({ ok: false, message: "Forbidden", data: [], errors: [] });
  }
  next();
}; // End of verifyToken
