const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Username is required" ]
    },
    emailId:{
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    isMainAdmin: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, {
  collection: 'user'
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isMainAdmin: this.isMainAdmin, isAdmin: this.isAdmin }, "bf44aaa26e4b43f4e2f549745e7678f9", { expiresIn: '1h' });
    return token;
};

userSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};



module.exports = mongoose.model('User', userSchema);