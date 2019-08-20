const { Crypto, validateCryptoDetails } = require('../../models/crypto');
const _ = require('lodash');
const CustomError = require("../../models/CustomError");
const Response = require("../../models/Response");
const CryptoController = {};

CryptoController.set = async (req, res) => {
    const { error } = validateCryptoDetails(req.body);
    if (error) throw new CustomError(400, error.details[0].message);

    let crypto = await Crypto.findOne({ 
            cryptoSymbol: req.body.cryptoSymbol,
            email: req.user.email,
            price: req.body.price
    });
    if (crypto) 
        throw new CustomError(400, 'Notification for this symbol for this price is already set');

    crypto = new Crypto(_.assign({},
         _.pick(req.body, ["cryptoSymbol", "price"]), 
         { email: req.user.email}
    ));
    await crypto.save();
    res.status(200).send(new Response(200, {
        message: "Successfully added task",
        data: crypto
    }, null));
};

CryptoController.getcryptolist = async (req, res) => {
    let crypto = await Crypto.find({email: req.user.email});
    res.status(200).send(new Response(200, {
        message: "Success",
        data: crypto
    }, null));
};

CryptoController.update = async (req, res) => {
    if (!req.body.id) throw new CustomError(400, 'Please provide id of a task to update');

    const { error } = validateCryptoDetails(req.body);
    if (error) throw new CustomError(400, error.details[0].message);

    let crypto = await Crypto.findOne({
            _id: req.body.id,
            email: req.user.email    
    });
    if (!crypto) throw new CustomError(400, 'No crypto has been found for this id'); 

    crypto.cryptoSymbol = req.body.cryptoSymbol;
    crypto.price = req.body.price;
    await crypto.save();

    res.status(200).send(new Response(200, {
        message: "Successfully updated task",
        data: crypto
    }, null));
};


CryptoController.delete = async (req, res) => {
    if (!req.body.id) throw new CustomError(400, 'Please provide id of a task to delete');

    let crypto = await Crypto.deleteOne({
        _id: req.body.id,
        email: req.user.email    
    });
    if (!crypto) throw new CustomError(400, 'No crypto has been found for this id');    
    res.status(200).send(new Response(200, {
        message: "Successfully deleted task",
        data: null
    }, null));
};



module.exports = CryptoController;