const { User, validateUserAtSignup, validateUserAtLogin} = require('../../models/user');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const UserController = {};

UserController.register = async (req, res) => {
    const { error } = validateUserAtSignup(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");

    user = new User(_.pick(req.body, ["name", "email", "password", "mobile"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.send("Success");
};


UserController.login = async (req, res) => {

    const { error } = validateUserAtLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.send(token);    
};

module.exports = UserController;