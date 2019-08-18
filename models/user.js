const mongoose = require('mongoose');

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
        type: String, 
        required: true, 
        unique: true,
        minlength: 10,
        maxlength: 10, 
    },
    verified:{
        type:Boolean, 
        default: false
    }
});

module.exports = mongoose.model('User', UserSchema);