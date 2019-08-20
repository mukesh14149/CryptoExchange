const { Crypto, validateCryptoDetails } = require('../models/crypto');
module.exports = function(){
    var WebSocket = require('ws');
    var ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
    let usersCrypto;
    Crypto.find({}).then((data)=> {
        usersCrypto = data;
    })

    ws.on('open', function () {
        console.log("Connected to Binance");
    });
    ws.on('message', function (data) {
        simpleData = {};
        let result = JSON.parse(data);
        for(let i=0;i<result.length;i++){
            simpleData[result[i]['s']] = result[i]['c'];
        }
        for(let i=0;i<usersCrypto.length;i++){
            if(simpleData[usersCrypto.cryptoSymbol] == usersCrypto.price){
                //do something
            }
        }
        Crypto.find({}).then((data)=> {
            usersCrypto = data;
        })
    });
}