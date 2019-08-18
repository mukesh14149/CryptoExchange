const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    mobile: { 
        type: Number, 
        required: true, 
        unique: true,
        minlength: 5,
        maxlength: 10, 
    },
    verified:{
        type:Boolean, 
        default: false
    }
});

function validateUserAtSignup(user) {
    const schema = {
        name: Joi.string()
            .required(),
        email: Joi.string()
            .required()
            .email(),
        password: Joi.string()
            .min(5)
            .max(15)
            .required(),
        mobile: Joi.number()
            .min(1111111111)
            .max(9999999999)
            .required()
    };
    return Joi.validate(user, schema);
}

function validateUserAtLogin(user) {
    const schema = {
        email: Joi.string()
            .required()
            .email(),
        password: Joi.string()
            .required(),
    };
    return Joi.validate(user, schema);
}


UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            mobile: this.mobile
        },
        config.get("secret")
        
    );
    return token;
};


const User = mongoose.model('User', UserSchema);
exports.User = User;
exports.validateUserAtSignup = validateUserAtSignup;
exports.validateUserAtLogin = validateUserAtLogin;