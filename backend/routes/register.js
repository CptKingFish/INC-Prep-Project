const express = require("express");
const router = express.Router();
// const registerController = require('../controllers/registerController');

// router.post('/', registerController.handleNewUser);

const registerController = require("../controllers/user.controller");

router.post("/", registerController.processRegister);

module.exports = router;
