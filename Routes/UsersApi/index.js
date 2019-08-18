const express = require("express");
const router = express.Router();
const handleRequest = require('../../middleware/handler');
const UserController = require("./userController");

router.post("/register", handleRequest(UserController.register));
router.post("/login", handleRequest(UserController.login));


module.exports = router;