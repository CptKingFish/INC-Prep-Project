const express = require("express");
const router = express.Router();
// const usersController = require("../../controllers/usersController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const adminController = require("../../controllers/admin.controller");

// router
//   .route("/")
//   .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
//   .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

// router
//   .route("/:id")
//   .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);

router.route("/adduser").post(adminController.addNewUserByAdmin);

module.exports = router;
