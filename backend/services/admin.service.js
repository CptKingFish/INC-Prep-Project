const config = require("../config/config");
const registerHtml = require("../html/registerHtml");
const E = require("../errors");
const util = require("util");
const pool = require("../config/database");
const { DbOption } = require("../config/dbservice.enums");

var SibApiV3Sdk = require("sib-api-v3-sdk");
SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
  config.sib_api_key;

module.exports.sendConfirmRegistrationEmail = async (
  userId,
  firstName,
  lastName,
  email,
  inviteToken
) => {
  console.log("sendConfirmRegistrationEmail method is called.");

  console.log("Sending email...");

  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();

  try {
    const sibResult =
      await new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
        subject: "Add password to complete registration",
        sender: { email: "api@sendinblue.com", name: "Sendinblue" },
        replyTo: { email: "api@sendinblue.com", name: "Sendinblue" },
        to: [{ name: `${firstName} ${lastName}`, email: email }],
        htmlContent: registerHtml(firstName, lastName, inviteToken),
        params: { bodyMessage: "Made just for you!" },
      });

    console.log(sibResult);

    const query = `UPDATE security_case_1_db.users
          SET verification_status = ?
          WHERE user_id = ?;`;
    console.log("Executing query >>>>>", query);

    const result = await connection.query(query, ["email sent", userId]);
    return result;
  } catch (error) {
    console.log(util.inspect(error));
    throw new E.InternalError({ originalError: error });
  } finally {
  }
};

module.exports.adminRegister = async function (
  first_name,
  last_name,
  email,
  verification_status
) {
  console.log("\nregister method is called.");

  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();

  // Create a uuid
  // const uuid = uuidv4();
  // console.log(`uuid: ${uuid}`);

  try {
    const userDataQuery =
      "INSERT INTO security_case_1_db.users (first_name, last_name, email, role_id, course_id, admission_id, verification_status) VALUES (?,?,?,?,?,?,?);";
    const results = await connection.query(userDataQuery, [
      first_name,
      last_name,
      email,
      2,
      1,
      "NA",
      verification_status,
    ]);
    return results[0];
  } catch (error) {
    console.log(error);
    if (error.errno === 1062) {
      const constraintRuleName = error.code;
      let duplicateError = null;
      let dataError = null;

      switch (constraintRuleName) {
        case "ER_DUP_ENTRY":
          duplicateError = new E.DuplicateError({
            parameter: "email",
            value: email,
          });
          dataError = new E.DataError({
            errors: [duplicateError],
            originalError: error,
            unexpectedError: false,
          });
          throw dataError;
        default:
          throw new E.DataError({
            message: "Email has been used.",
            originalError: error,
            unexpectedError: true,
          });
      }
    } else {
      throw new E.InternalError({ originalError: error });
    }
  } finally {
    await connection.release();
  }
}; // End of register

module.exports.addInviteToken = async (userId, token) => {
  console.log("addInviteToken method is called.");

  console.log("Creating connection...");
  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();
  try {
    const query = `INSERT INTO security_case_1_db.invite_tokens (user_id, invite_token) VALUES (?,?)`;
    console.log("Executing query >>>>>", query);

    const result = await connection.query(query, [userId, token]);
    return result;
  } catch (error) {
    console.log(util.inspect(error));
    throw new E.InternalError({ originalError: error });
  } finally {
    await connection.release();
  }
}; // End of addRefreshToken
