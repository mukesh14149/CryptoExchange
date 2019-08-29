const { Crypto, validateCryptoDetails } = require('../../models/crypto');
const _ = require('lodash');
const CustomError = require("../../models/CustomError");
const Response = require("../../models/Response");
var request = require('request');
const { updateData } = require('../../Service/binance')
const CryptoController = {};

// Create a task
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
        _.pick(req.body, ["cryptoSymbol", "price", "priceType"]), 
         { email: req.user.email}
    ));
    await crypto.save();
    client.HMSET(crypto._id.toString(), {
        "email": req.user.email,
        "cryptoSymbol": req.body.cryptoSymbol,
        "price": req.body.price,
        "priceType": req.body.priceType
    },function(err, result){
        if(!err){
            updateData(crypto._id.toString());
            res.status(200).send(new Response(200, {
                message: "Successfully added task",
                data: crypto
            }, null));
        }
        else{
            Crypto.deleteOne({
                _id: crypto._id
            }).then(()=> {
                throw new CustomError(500, "Something Went Wrong");
            })
        }
    });
   
};

// Update a task
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
    crypto.priceType = req.body.priceType;
    await crypto.save();
    client.HMSET(crypto._id, {
        "email": req.user.email,
        "cryptoSymbol": req.body.cryptoSymbol,
        "price": req.body.price,
        "priceType": req.body.priceType
    },function(err, result){
        if(!err){
            updateData();
            res.status(200).send(new Response(200, {
                message: "Successfully updated task",
                data: crypto
            }, null));
        }
        else{
            throw new CustomError(500, "Something Went Wrong");
        }
    });
    
};

// Delete a task
CryptoController.delete = async (req, res) => {
    if (!req.body.id) throw new CustomError(400, 'Please provide id of a task to delete');
    let crypto = await Crypto.deleteOne({
        _id: req.body.id,
        email: req.user.email    
    });
    if (crypto.deletedCount == 0) throw new CustomError(400, 'No crypto has been found for this id');   
    
    client.DEL(req.body.id, function(err, result){
        res.status(200).send(new Response(200, {
            message: "Successfully deleted task",
            data: null
        }, null));
    });
};

// Get all symbol list from binance
CryptoController.getallcryptosymbol = async (req, res) => {
    request(' https://api.binance.com/api/v3/ticker/price', function (error, response, body) {
        if (error) throw new CustomError(400, 'Problem occur in fetching data');
        res.status(response.statusCode).send(new Response(response.statusCode, {
            message: "Success",
            data: JSON.parse(body)
        }, null));
    });
};

// Get all task set by user
CryptoController.getcryptolist = async (req, res) => {
    let crypto = await Crypto.find({ email: req.user.email });
    res.status(200).send(new Response(200, {
        message: "Success",
        data: crypto
    }, null));
};

module.exports = CryptoController;