const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
    }],
    domain: {
        type: Number,
        required: false,
    },
    schedule: [
        {
            dayOfWeek: String,
            startTime: String,
            endTime: String,
        },
    ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
