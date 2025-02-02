const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    start: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: false,
    },
    paid: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    finished: {
        type: Boolean,
        required: false,
    },
},
    {
        timestamps: true
    });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
