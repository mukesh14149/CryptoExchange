const { User, validateUserAtSignup, validateUserAtLogin} = require('../../models/user');
const bcrypt = require('bcrypt');
var uniqid = require('uniqid');
const _ = require('lodash');
const mailer = require('../../Service/sendEmail');
const emailTemplate = require('../../models/emailTemplate');
const CustomError = require("../../models/CustomError");
const Response = require("../../models/Response");
const UserController = {};

// User Registration
UserController.register = async (req, res) => {
    const { error } = validateUserAtSignup(req.body);
    if (error) throw new CustomError(400, error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) throw new CustomError(400, "User already registered");

    user = new User(_.pick(req.body, ["name", "email", "password", "mobile"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.uniqueHash = uniqid();
    let result = await user.save();
    if(result){
        var emailOptions = Object.assign({}, emailTemplate.Default);
        emailOptions.to = req.body.email;
        emailOptions.text = "http://localhost:3000/users/confirmemail?id=" + user.uniqueHash;
        mailer.sendmail(emailOptions);
        res.status(200).send(new Response(200, {
            message: "Email verification link has been sent to your Email id",
            data: _.pick(user, ["_id", "name", "email", "mobile"])
        }, null));
    }
};

//User login
UserController.login = async (req, res) => {
    const { error } = validateUserAtLogin(req.body);
    if (error) throw new CustomError(400, error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) throw new CustomError(400, "Invalid email or password");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) throw new CustomError(400, "Invalid email or password");

    if(!user.verified){
        var emailOptions = Object.assign({}, emailTemplate.Default);
        emailOptions.to = req.body.email;
        emailOptions.text = "http://localhost:3000/users/confirmemail?id=" + user.uniqueHash;
        mailer.sendmail(emailOptions);
        throw new CustomError(403, "Email not verified, Please check your email to verify");
    }
    const token = user.generateAuthToken();
    res.status(200).send(new Response(200, {
        message: "Login Successfully",
        data: {token: token}
    }, null));  
};

// When user confirmemail
UserController.confirmEmail = async (req, res) => {
    let user = await User.findOne({ uniqueHash: req.query.id });
    if (!user) throw new CustomError(400, "Invalid Id");
    user.verified = true;
    await user.save();
    res.status(200).send(new Response(200, {
        message: "Email Verify Successfully",
        data: null
    }, null));  
};
module.exports = UserController;