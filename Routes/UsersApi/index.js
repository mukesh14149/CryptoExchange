const express = require("express");
const router = express.Router();
const handleRequest = require('../../middleware/handler');
const UserController = require("./userController");

router.post("/register", handleRequest(UserController.register));
router.post("/login", handleRequest(UserController.login));
router.get("/confirmemail", handleRequest(UserController.confirmEmail));


module.exports = router;