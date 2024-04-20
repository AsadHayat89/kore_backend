const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userImg: {
        type: String
    },
    education: {
        type: String,
    },
    cv: {
        type: String
    },
    drivingLicense: {
        type: String
    },
    categories: [{
        type: String
    }],
    interests: [{
        type: String
    }]
});

const User = mongoose.model('profile', userSchema);

module.exports = User;
