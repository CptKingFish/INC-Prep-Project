const util = require("util");
const pool = require("../config/database");
const E = require("../errors");
const { DbOption } = require("../config/dbservice.enums");

module.exports.findUser = async ({ email, refreshToken, actionType }) => {
  console.log("findUser method is called.");
  console.log(`auth.service.js>>>findUser method>>>has [two action types]`);
  console.log(
    "FIND_ONE_USER_USING_REFRESH_TOKEN and FIND_ONE_USER_USING_EMAIL"
  );
  console.log("Creating connection...");
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();

  let result;
  switch (actionType) {
    case DbOption.FIND_ONE_USER_USING_REFRESH_TOKEN:
      try {
        // This switch case logic needs refreshToken parameter value to search
        console.log("search by fresh token technique>>>[started]");
        const query = `
            SELECT u.user_id, u.email, u.first_name, u.last_name, r.role_name
            FROM security_case_1_db.users AS u
            INNER JOIN security_case_1_db.user_roles AS r 
            ON r.role_id = u.role_id
            INNER JOIN security_case_1_db.refresh_tokens AS rt ON u.user_id = rt.user_id  
            WHERE rt.token = ?
        `;

        console.log("Executing query >>>>>", query);
        result = await connection.query(query, [refreshToken]);
        return result[0];
      } catch (error) {
        console.log(util.inspect(error));
        throw new E.InternalError({ originalError: error });
      } finally {
        await connection.release();
      }
    case DbOption.FIND_ONE_USER_USING_EMAIL:
      try {
        // This switch case logic needs email parameter value to search
        console.log("search by email technique>>>[started]");
        const query = `
            SELECT u.user_id, u.first_name, u.last_name, u.email, u.password, u.role_id, r.role_name
            FROM security_case_1_db.users AS u
            INNER JOIN security_case_1_db.user_roles AS r 
            ON r.role_id = u.role_id
            WHERE u.email = ? 
          `;

        console.log("Executing query >>>>>", query);
        result = await connection.query(query, [email]);
        return result[0];
      } catch (error) {
        console.log(util.inspect(error));
        throw new E.InternalError({ originalError: error });
      } finally {
        await connection.release();
      }
    default:
  } // End of switch
}; // End of findUser

module.exports.addRefreshToken = async (userId, refreshToken) => {
  console.log("addRefreshToken method is called.");

  console.log("Creating connection...");
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  try {
    const query = `INSERT INTO security_case_1_db.refresh_tokens (user_id, token) VALUES (?,?)`;
    console.log("Executing query >>>>>", query);

    const result = await connection.query(query, [userId, refreshToken]);
    return result;
  } catch (error) {
    console.log(util.inspect(error));
    throw new E.InternalError({ originalError: error });
  } finally {
    await connection.release();
  }
}; // End of addRefreshToken

module.exports.findRefreshToken = async ({
  userId,
  refreshToken,
  actionType,
}) => {
  console.log("findRefreshToken mehtod is called.");
  console.log(`findRefreshToken method>>>[One action type]`);
  console.log("FIND_ONE_REFRESH_TOKEN_USING_USERID_AND_REFRESH_TOKEN");
  console.log("Creating connection...");
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();

  let result;
  switch (actionType) {
    case DbOption.FIND_ONE_REFRESH_TOKEN_USING_USERID_AND_REFRESH_TOKEN:
      try {
        console.log("Using the obtained user id and refresh token");
        console.log("to search the refresh token in the database.");
        const query = `
            SELECT * FROM security_case_1_db.refresh_tokens 
            WHERE user_id = ? AND token = ?
        `;

        console.log("Executing query >>>>>", query);
        result = await connection.query(query, [userId, refreshToken]);
        console.log(util.inspect(result[0]));
        return result;
      } catch (error) {
        console.log(util.inspect(error));
        throw new E.InternalError({ originalError: error });
      } finally {
        await connection.release();
      }
    default:
  } // End of switch
}; // End of findRefreshToken

module.exports.deleteRefreshToken = async ({
  refreshToken,
  userId,
  actionType,
}) => {
  console.log("deleteRefreshToken method is called.");
  console.log(`deleteRefreshToken data service method>>>[two action types]`);
  console.log("DELETE_ONE_REFRESH_TOKEN and DELETE_ALL_REFRESH_TOKENS");
  console.log("Creating connection...");
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();

  let result;
  switch (actionType) {
    case DbOption.DELETE_ONE_REFRESH_TOKEN:
      try {
        console.log(
          "search by using refresh token technique (to delete one token only)"
        );
        const query = `DELETE FROM security_case_1_db.refresh_tokens WHERE token = ?`;
        console.log("Executing query >>>>>", query);
        result = await connection.query(query, [refreshToken]);
        console.log(
          ">>>>Is the token deleted?>>>Inspect the [result.affectedRows]."
        );
        console.log(util.inspect(result[0].affectedRows));
        return result;
      } catch (error) {
        console.log(util.inspect(error));
        throw new E.InternalError({ originalError: error });
      } finally {
        await connection.release();
      }
    case DbOption.DELETE_ALL_REFRESH_TOKENS:
      try {
        console.log("Delete all refresh tokens (by user id) technique");
        const query = `DELETE FROM security_case_1_db.refresh_tokens WHERE user_id = ?`;
        console.log("Executing query >>>>>", query);
        result = await connection.query(query, [userId]);
        return result;
      } catch (error) {
        console.log(util.inspect(error));
        throw new E.InternalError({ originalError: error });
      } finally {
        await connection.release();
      }
    default:
  } // End of switch
}; // End of deleteRefreshToken
