const { v4: uuidv4 } = require("uuid");
const pool = require("../config/database");
const E = require("../errors");

module.exports.register = async function (
  first_name,
  last_name,
  email,
  password
) {
  console.log("\nregister method is called.");

  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();

  // Create a uuid
  // const uuid = uuidv4();
  // console.log(`uuid: ${uuid}`);

  try {
    const userDataQuery =
      "INSERT INTO security_case_1_db.users (first_name, last_name, email, password, role_id, course_id, admission_id) VALUES (?,?,?,?,?,?,?);";
    const results = await connection.query(userDataQuery, [
      first_name,
      last_name,
      email,
      password,
      2,
      1,
      "NA",
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

module.exports.updateProfile = async function (
  first_name,
  last_name,
  email,
  password,
  user_id
) {
  console.log("\nupdateProfile method is called.");

  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();

  try {
    const userDataQuery =
      "UPDATE security_case_1_db.users SET first_name=?, last_name=?, email=?, password=? WHERE user_id=?;";
    const results = await connection.query(userDataQuery, [
      first_name,
      last_name,
      email,
      password,
      user_id,
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
}; // End of updateProfile

module.exports.getProfileDetails = async function (user_id) {
  console.log("\ngetProfileDetails method is called.");

  const promisePool = pool.promise();
  const connection = await promisePool.getConnection();

  try {
    const userDataQuery =
      "SELECT first_name, last_name, email, updated_at, created_at FROM security_case_1_db.users WHERE user_id=?;";
    const results = await connection.query(userDataQuery, [user_id]);
    return results[0];
  } catch (error) {
    console.log(error);
    throw new E.InternalError({ originalError: error });
  } finally {
    await connection.release();
  }
}; // End of getProfileDetails
