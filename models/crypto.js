const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const CryptoSchema = new mongoose.Schema({
    cryptoSymbol: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 25
    },
    email: {
        type: String,
        required: true,
    }
});

function validateCryptoDetails(cryptoData) {
    const schema = {
        id: Joi.string(),
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