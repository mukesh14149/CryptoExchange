module.exports = function(){
    var WebSocket = require('ws');
    var ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
    ws.on('open', function () {
        console.log("Connected to Binance");
    });
    ws.on('message', function (data) {
       // console.log("got Response");
    });
}