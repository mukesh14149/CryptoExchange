const express = require("express");
const router = express.Router();
const handleRequest = require('../../middleware/handler');
const CryptoController = require("./cryptoController");

router.post("/set", handleRequest(CryptoController.set));
router.get("/getcryptolist", handleRequest(CryptoController.getcryptolist));
router.post("/delete", handleRequest(CryptoController.delete));
router.post("/update", handleRequest(CryptoController.update));


module.exports = router;