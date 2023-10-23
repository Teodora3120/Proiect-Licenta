const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false // Set to false by default
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
