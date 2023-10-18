const express = require('express');
const router = express.Router();
const Order = require('../models/Order')
const User = require('../models/User')
const Service = require('../models/Service')


router.post('/create-order', async (req, res) => {
    try {
        const { customerId, workerId, serviceId, date, start, paid } = req.body;

        if (!customerId || !workerId || !serviceId || !date || !start || !paid) {
            return res.status(400).json('Missing required fields');
        }

        const newOrder = new Order({
            customerId,
            workerId,
            serviceId,
            date,
            start,
            paid,
            finished: false
        });

        const savedOrder = await newOrder.save();

        // Find the user by userId and update their services array
        const customer = await User.findById(customerId);

        if (!customer) {
            return res.status(404).json('Customer not found');
        }

        // Add the service's _id to the user's services array
        await customer.updateOne({ $push: { orders: savedOrder._id } });

        // Find the user by userId and update their services array
        const worker = await User.findById(workerId);

        if (!worker) {
            return res.status(404).json('Worker not found');
        }

        // Add the service's _id to the user's services array
        await worker.updateOne({ $push: { orders: savedOrder._id } })

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});


router.get('/get-orders/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json('Missing required fields');
        }
        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json('User not found');
        }

        if (user.type === "customer") {
            const orders = await Order.find({ customerId: userId });
            res.status(200).json(orders);
        } else if (user.type === "worker") {
            const orders = await Order.find({ workerId: userId });
            res.status(200).json(orders);
        } else {
            res.status(404).json("User type unknown");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});



module.exports = router;
