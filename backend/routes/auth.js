const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
// const authController = require('../controllers/authController');

// router.post('/', authController.handleLogin);
router.post("/", authController.processLogin);

module.exports = router;
