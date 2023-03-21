const adminManager = require("../services/admin.service");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const util = require("util");
const E = require("../errors");

exports.addNewUserByAdmin = async (req, res, next) => {
  let errors = [];

  const { firstName, lastName, email } = req.body;

  if (firstName === "" || lastName === "" || email === "") {
    // Check for empty inputs
    errors = [
      ...errors,
      new E.ParameterError({
        parameter: "Input fields",
        value: "Empty input fields",
        message: "All input fields is required to be filled.",
      }),
    ];
  }

  if (errors.length > 0) {
    const dataError = new E.DataError({ errors });
    console.log(util.inspect(dataError));
    return next(dataError);
  }

  try {
    let userId = null;

    try {
      const results = await adminManager.adminRegister(
        firstName,
        lastName,
        email,
        "email not sent"
      );
      if (results.affectedRows < 1 || results.insertId === undefined) {
        console.log(results);
        console.log(results.affectedRows < 1);
        console.log(!results.insertId);
        throw new E.InternalError({ originalError: "Registration failure" });
      }
      userId = results.insertId;
    } catch (error) {
      return next(error);
    }

    const inviteToken = uuid();

    await adminManager.addInviteToken(userId, inviteToken);

    try {
      const result = await adminManager.sendConfirmRegistrationEmail(
        userId,
        firstName,
        lastName,
        email,
        inviteToken
      );
    } catch (error) {
      return next(error);
    }

    return res.status(201).json({
      statusCode: 201,
      ok: true,
      message: "Register successful",
    });
  } catch (error) {
    console.log("Error inside sendConfirmRegistrationEmail: ", error);
    return next(error);
  }
};
