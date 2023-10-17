const express = require('express');
const router = express.Router();
const Order = require('../models/Order')

router.post('/create-order', async (req, res) => {
    try {
        const { customerId, workerId, serviceId, date, start, paid } = req.body;
        console.log(customerId, workerId, serviceId, date, start, paid)
        // Check if all required fields are present in the request body
        if (!customerId || !workerId || !serviceId || !date || !start || paid === undefined) {
            return res.status(400).json('Missing required fields');
        }

        // Create a new service document
        const newOrder = new Order({
            customerId,
            workerId,
            serviceId,
            date,
            start,
            paid,
            finished: false
        });

        // Save the service document to the services collection
        const savedOrder = await newOrder.save();

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});


module.exports = router;
