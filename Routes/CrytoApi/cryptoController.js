const { Crypto, validateCryptoDetails } = require('../../models/crypto');
const _ = require('lodash');

const CryptoController = {};

CryptoController.set = async (req, res) => {
    const { error } = validateCryptoDetails(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    res.send("Success");
};

module.exports = CryptoController;