const express = require("express");
const router = express.Router();
const handleRequest = require('../../middleware/handler');
const CryptoController = require("./cryptoController");

router.post("/set", handleRequest(CryptoController.set));
router.get("/getallcryptosymbol", handleRequest(CryptoController.getallcryptosymbol));
router.get("/getcryptolist", handleRequest(CryptoController.getcryptolist));
router.delete("/delete", handleRequest(CryptoController.delete));
router.put("/update", handleRequest(CryptoController.update));

module.exports = router;