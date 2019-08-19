const { User, validateUserAtSignup, validateUserAtLogin} = require('../../models/user');
const bcrypt = require('bcrypt');
var uniqid = require('uniqid');
const _ = require('lodash');
const mailer = require('../../Service/sendEmail');
const emailTemplate = require('../../template/emailTemplate');
const UserController = {};

UserController.register = async (req, res) => {
    const { error } = validateUserAtSignup(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");

    user = new User(_.pick(req.body, ["name", "email", "password", "mobile"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.uniqueHash = uniqid();
    await user.save();

    var emailOptions = Object.assign({}, emailTemplate.Default);
    emailOptions.to = req.body.email;
    emailOptions.text = "http://localhost:3000/users/confirmemail?id="+ user.uniqueHash;
    mailer.sendmail(emailOptions);
    
    res.send("Email verification link has been sent to your email id");
};


UserController.login = async (req, res) => {

    const { error } = validateUserAtLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    if(!user.verified){
        var emailOptions = Object.assign({}, emailTemplate.Default);
        emailOptions.to = req.body.email;
        emailOptions.text = "http://localhost:3000/users/confirmemail?id=" + user.uniqueHash;
        mailer.sendmail(emailOptions);
        return res.send("Email not verified, Please check your email to verify");
    }
    const token = user.generateAuthToken();
    res.send(token);    
};


UserController.confirmEmail = async (req, res) => {
    let user = await User.findOne({ uniqueHash: req.query.id });
    if (!user) return res.status(400).send('Invalid Id');

    user.verified = true;
    await user.save();
    res.send("Success");
};
module.exports = UserController;