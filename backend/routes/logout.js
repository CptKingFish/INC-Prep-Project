const express = require("express");
const router = express.Router();
const logoutController = require("../controllers/auth.controller");
// const logoutController = require('../controllers/logoutController');

// router.get('/', logoutController.handleLogout);
router.get("/", logoutController.processLogout);

module.exports = router;
