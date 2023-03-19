const bcrypt = require("bcrypt");
const util = require("util");
const userManager = require("../services/user.service");
const E = require("../errors");

exports.processRegister = async (req, res, next) => {
  console.log("processRegister running.");

  // Get register data
  const { first_name, last_name, email, password } = req.body;
  let errors = [];

  // Validation
  if (
    first_name === "" ||
    last_name === "" ||
    email === "" ||
    password === ""
  ) {
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

  // Check if there are errors
  if (errors.length > 0) {
    const dataError = new E.DataError({ errors });
    console.log(util.inspect(dataError));
    return next(dataError);
  }

  try {
    // Hash password
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.log("Error on hashing password");
        throw new E.InternalError({ originalError: err });
      } else {
        // Hash password successful
        // Execute query
        try {
          const results = await userManager.register(
            first_name,
            last_name,
            email,
            hash
          );
          if (results.affectedRows === 1) {
            console.log(results);
            return res.status(201).json({
              statusCode: 201,
              ok: true,
              message: "Register successful",
            });
          }
        } catch (error) {
          return next(error);
        }
      }
    }); // End of hashing
  } catch (error) {
    return next(error);
  }
}; // End of processRegister

exports.processUpdateProfile = async (req, res, next) => {
  console.log("processUpdateProfile running");

  // Get update details
  const { userId, first_name, last_name, email, password } = req.body;

  const uuid = userId;

  let errors = [];

  // Validation
  if (uuid === "") {
    // Check if uuid exists
    errors = [
      ...errors,
      new E.BadRequestError({
        parameter: "uuid",
        value: "Empty uuid",
        message: "Uuid is empty.",
      }),
    ];
  } else if (
    first_name === "" ||
    last_name === "" ||
    email === "" ||
    password === ""
  ) {
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

  // Check if there are errors
  if (errors.length > 0) {
    const dataError = new E.DataError({ errors });
    console.log(util.inspect(dataError));
    return next(dataError);
  }

  try {
    // Hash password
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.log("Error on hashing password");
        throw new E.InternalError({ originalError: err });
      } else {
        // Hash password successful
        // Execute query
        try {
          const results = await userManager.updateProfile(
            first_name,
            last_name,
            email,
            hash,
            uuid
          );
          if (results.affectedRows === 1) {
            console.log(results);
            return res.status(200).json({
              statusCode: 200,
              ok: true,
              message: "Update details successful",
            });
          }
          return res.status(404).json({
            statusCode: 404,
            ok: true,
            message: "No such user exists",
          });
        } catch (error) {
          return next(error);
        }
      }
    }); // End of hashing
  } catch (error) {
    return next(error);
  }
}; // End of processUpdateProfile

exports.processGetProfileDetails = async (req, res, next) => {
  console.log("processGetProfileDetails running");

  // Get uuid
  const { userId } = req.body;
  const uuid = userId;

  let errors = [];

  // Validation
  if (uuid === "") {
    // Check if uuid exists
    errors = [
      ...errors,
      new E.BadRequestError({
        parameter: "uuid",
        value: "Empty uuid",
        message: "Uuid is empty.",
      }),
    ];
  }

  // Check if there are errors
  if (errors.length > 0) {
    const dataError = new E.DataError({ errors });
    console.log(util.inspect(dataError));
    return next(dataError);
  }

  try {
    const results = await userManager.getProfileDetails(uuid);
    if (results.length === 1) {
      console.log(results);
      const data = {
        first_name: results[0].first_name,
        last_name: results[0].last_name,
        email: results[0].email,
        updated_at: results[0].updated_at,
        created_at: results[0].created_at,
      }; // End of data variable setup
      return res.status(200).json({
        statusCode: 200,
        ok: true,
        message: "Read profile details successful",
        data,
      });
    }
    return res
      .status(404)
      .json({ statusCode: 404, ok: true, message: "No such user exists" });
  } catch (error) {
    return next(error);
  }
}; // End of processGetProfileDetails
