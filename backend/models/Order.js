const mongoose = require('mongoose');

// Define the Order schema
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
    paid: {
        type: String,
        required: false,
    },
    finished: {
        type: Boolean,
        required: false,
    },
},
    {
        timestamps: true // Automatically add createdAt and updatedAt fields
    });

// Create the 'Order' model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
