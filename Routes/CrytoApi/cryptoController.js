const { Crypto, validateCryptoDetails } = require('../../models/crypto');
const _ = require('lodash');

const CryptoController = {};

CryptoController.set = async (req, res) => {
    const { error } = validateCryptoDetails(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let crypto = await Crypto.findOne({ 
            cryptoSymbol: req.body.cryptoSymbol,
            email: req.user.email,
            price: req.body.price
    });
    if (crypto) return res.status(400).send('Notification for this symbol for this price is already set');

    crypto = new Crypto(_.assign({},
         _.pick(req.body, ["cryptoSymbol", "email", "price"]), 
         { email: req.user.email}
    ));
    await crypto.save();
    res.send("Success");
};

module.exports = CryptoController;