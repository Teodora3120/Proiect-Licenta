const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    stars: {
        type: Number,
        required: true,
    },
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
