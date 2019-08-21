var express = require('express');
const app = express();
const mongoose = require('mongoose');
const userApi = require('./Routes/UsersApi/index')
const crytoApi = require('./Routes/CrytoApi/index')
const auth = require('./middleware/auth')
const config = require('config')
const binance = require('./Service/binance')();
var readline = require('linebyline');
var fs = require('fs');
var schedule = require('node-schedule');

mongoose.connect(config.get('db'), { useNewUrlParser: true, useCreateIndex: true }).then(() => {
    console.log("mongodb connected");
})

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use("/users", userApi);
app.use("/crypto", auth, crytoApi);



// // let startTime = new Date(Date.now());
// // var j = schedule.scheduleJob({ start: startTime, rule: '*/5 * * * * *' }, function () {
// //     console.log('Example');
// // });
// rl = readline('mynewfile1.txt');
// rl.on('line', function (line, lineCount, byteCount) {
//     // do something with the line of text
//     console.log(line);
//    // output.write(line + '\n');
// })
// .on('error', function (e) {
//     // something went wrong
//     console.log(e);
// });


app.listen(3000, ()=> {console.log("Starting server")});