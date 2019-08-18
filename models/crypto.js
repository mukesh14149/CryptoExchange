const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
var jwt = require('jsonwebtoken');
const CryptoSchema = new mongoose.Schema({
    cryptoSymbol: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 25
    }
});

function validateCryptoDetails(cryptoData) {
    const schema = {
        cryptoSymbol: Joi.string()
            .required(),
        price: Joi.string()
            .min(5)
            .max(15)
            .required(),
    };
    return Joi.validate(cryptoData, schema);
}

const Crypto = mongoose.model('Crypto', CryptoSchema);
exports.Crypto = Crypto;
exports.validateCryptoDetails = validateCryptoDetails;