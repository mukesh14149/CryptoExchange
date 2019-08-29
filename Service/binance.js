const { Crypto } = require('../models/crypto');
let usersCrypto = [];
let simpleData = {}; // map which contain symbol-price relation

//Check user's set price is already in simpledata.
priceCheckAtInsertion = function(crypto){
    let flag = 0;
    if(crypto.priceType){
        if(simpleData['cryptoSymbol'] && simpleData['cryptoSymbol'] >= crypto['price']){
            flag = 1;
            updateTask(crypto['_id'].toString())
        }
    }else{
        if(simpleData['cryptoSymbol'] && simpleData['cryptoSymbol'] <= crypto['price']){
            flag = 1;
            updateTask(crypto['_id'].toString())
        }
    }
    return flag == 1 ? true: false;
}

// Add id field in Mail_list hash whenever it hits specified price
updateTask = function(id){
    let obj = {}
    obj[id] = id;
    client.HEXISTS("Mail_list", `${id.toString()}`, function(err, result){
        if(result != 1){
            client.HMSET("Mail_list", obj,function(err, result){});
        }
    })
    client.DEL(id, function(err, result){
        let index = usersCrypto.map((item) => {return item['_id']}).indexOf(id);
        usersCrypto.splice(index, 1)
    })   
}

exports.binanceApi = function(){
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
        let result = JSON.parse(data);
        for(let i=0;i<result.length;i++){
            simpleData[result[i]['s']] = result[i]['c'];
        }

        // Go over all crypto and check for price
        for(let i=0;i<usersCrypto.length;i++){ 
            if(usersCrypto[i].priceType){
                if(simpleData[usersCrypto[i].cryptoSymbol] >= usersCrypto[i].price){
                    updateTask(usersCrypto[i]['_id'].toString())
                }
            }else{
                if(simpleData[usersCrypto[i].cryptoSymbol] <= usersCrypto[i].price){
                    updateTask(usersCrypto[i]['_id'].toString())
                }
            }
        }
    });
}

updateData =  function(id){
    client.HMGET(id, ["cryptoSymbol", "price", "priceType"], async function(err, result){
        let crypto = {
            _id: id,
            cryptoSymbol: result[0],
            price: result[1],
            priceType: result[2]
        }
        let res = await priceCheckAtInsertion(crypto);
        if(!res)
            usersCrypto.push(crypto);
    });
}

exports.updateData = updateData;
exports.priceCheckAtInsertion = priceCheckAtInsertion;