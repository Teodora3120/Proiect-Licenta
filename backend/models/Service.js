const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    domain: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true
    }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
