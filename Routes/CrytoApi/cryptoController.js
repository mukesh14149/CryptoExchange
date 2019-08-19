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

CryptoController.getcryptolist = async (req, res) => {
    let crypto = await Crypto.find({email: req.user.email});
    if (!crypto) return res.status(400).send('No crypto has been found for this email');
    res.send(crypto);
};

CryptoController.update = async (req, res) => {
    if (!req.body.id) return res.status(400).send("Please provide id of a task to update");

    const { error } = validateCryptoDetails(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let crypto = await Crypto.findOne({
            _id: req.body.id,
            email: req.user.email    
    });
    if (!crypto) return res.status(400).send('No crypto has been found for this id');

    crypto.cryptoSymbol = req.body.cryptoSymbol;
    crypto.price = req.body.price;
    await crypto.save();

    res.send(crypto);
};


CryptoController.delete = async (req, res) => {
    if (!req.body.id) return res.status(400).send("Please provide id of a task to delete");

    let crypto = await Crypto.deleteOne({
        _id: req.body.id,
        email: req.user.email    
    });
    if (!crypto) return res.status(400).send('No crypto has been found for this id');    
    res.send("Success");
};



module.exports = CryptoController;