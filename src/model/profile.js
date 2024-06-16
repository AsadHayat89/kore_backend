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
    }],
    location: {
        type: String
    },
    friendlyAddress: {
        type: String
    },
    phoneNumber: {
        type: Number
    },
    minimumPerHourRate: {
        type: Number
    },
    gender: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    jobTitle: {
        type: String
    },
    category: {
        type: String
    },
    englishLevel: {
        type: String
    },
    type: {
        type: String
    },
    description: {
        type: String
    },
    mapLocation: {
        type: String
    },
    showMyProfile: {
        type: Boolean,
        default: true
    },
    resume: {
        type: String
    }
});

const Profile = mongoose.model('profile', userSchema);

module.exports = Profile;
