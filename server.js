var express = require('express');
const app = express();
const mongoose = require('mongoose');
const userApi = require('./Routes/UsersApi/index')
const crytoApi = require('./Routes/CrytoApi/index')
const auth = require('./middleware/auth')
const config = require('config')

/* web socket connection to fetch realtime price for all symbols */
require('./Service/binance')();

/* Scheduler to send email to user for all task whos price just hit. */
require('./Service/scheduler')(); 

/*Mongoose connection*/
mongoose.connect(config.get('db'), { useNewUrlParser: true, useCreateIndex: true }).then(() => {
    console.log("mongodb connected");
})

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

/* Contain user related routes*/
app.use("/users", userApi);

/* Contain crypto related routes*/
app.use("/crypto", auth, crytoApi);


app.listen(3000, ()=> {console.log("Starting server")});