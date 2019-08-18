var express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const db = "mongodb://localhost:27017/binance"
const handleResponse = require('./middleware/handler')
const _ = require('lodash');
const bcrypt = require('bcrypt');
const userApi = require('./Routes/UsersApi/index')
mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true }).then(() => {
    console.log("mongodb connected");
})

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use("/users", userApi);

app.post('/', handleResponse(async (req, res)=> {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");
    console.log(req.body);
    user = new User(_.pick(req.body, ["name", "email", "password", "mobile"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.send("Success");
}))

app.use((err, req, res, next) => {
    console.log(err.errmsg);
    res.send("Something failed");
})
app.listen(3000, ()=> {console.log("Starting server")});