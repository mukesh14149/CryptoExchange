const { Crypto, validateCryptoDetails } = require('../models/crypto');
let usersCrypto;

/* Whenever price matches with set task price it will updata db with pricehit time */
updateTask = async function(price, type){
    let crypto = await Crypto.findOne({
        price: price,
        priceType: type   
    });
    if(crypto){
        crypto.priceHitTime = new Date();
        await crypto.save();
    }
}
module.exports = function(){
    var WebSocket = require('ws');
    var ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

    /* Fetch all crypto data from db */
    Crypto.find({}).then((data)=> {
        usersCrypto = data;
    })

    ws.on('open', function () {
        console.log("Connected to Binance");
    });
    ws.on('message', function (data) {
        /* price comparision */
        simpleData = {}; // map which contain symbol-price relation
        let result = JSON.parse(data);
        for(let i=0;i<result.length;i++){
            simpleData[result[i]['s']] = result[i]['c'];
        }

        // Go over all crypto and check for price
        for(let i=0;i<usersCrypto.length;i++){            
            if(usersCrypto[i].priceType){
                if(simpleData[usersCrypto[i].cryptoSymbol] >= usersCrypto[i].price){
                    updateTask(usersCrypto[i].price, usersCrypto[i].priceType)
                }
            }else{
                if(simpleData[usersCrypto[i].cryptoSymbol] <= usersCrypto[i].price){
                    updateTask(usersCrypto[i].price, usersCrypto[i].priceType)
                }
            }
        }

        //Keep check for db for newly added task
        Crypto.find({}).then((data)=> {
            usersCrypto = data;
        })
    });
}