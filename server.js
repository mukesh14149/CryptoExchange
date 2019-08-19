var express = require('express');
const app = express();
const mongoose = require('mongoose');
const userApi = require('./Routes/UsersApi/index')
const crytoApi = require('./Routes/CrytoApi/index')
const auth = require('./middleware/auth')
const config = require('config')
const binance = require('./Service/binance')();

mongoose.connect(config.get('db'), { useNewUrlParser: true, useCreateIndex: true }).then(() => {
    console.log("mongodb connected");
})

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use("/users", userApi);
app.use("/crypto", auth, crytoApi);

app.use((err, req, res, next) => {
    console.log(err);
    res.send("Something failed");
})
app.listen(3000, ()=> {console.log("Starting server")});