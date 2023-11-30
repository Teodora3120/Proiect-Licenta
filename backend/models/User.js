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
    dateOfBirth: {
        type: String,
        required: true,
    },
    city: {
        type: Number,
        required: true,
    },
    telephoneNumber: {
        type: Number,
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
    rating: {
        type: Number,
        required: false
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }],
},
    {
        timestamps: true // Automatically add createdAt and updatedAt fields
    });

const User = mongoose.model('User', userSchema);

module.exports = User;
