const express = require("express");
const router = express.Router();
const refreshTokenController = require("../controllers/auth.controller");
// const refreshTokenController = require('../controllers/refreshTokenController');

// router.get('/', refreshTokenController.handleRefreshToken);
router.get("/", refreshTokenController.processRefreshToken);
router.get("/check", refreshTokenController.processLoginStatus);

module.exports = router;
