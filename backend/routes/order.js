const express = require('express');
const router = express.Router();
const Order = require('../models/Order')
const User = require('../models/User')
const Notification = require('../models/Notification')
const { userConnections } = require('../socketConnections');

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
            finished: false,
            status: "On going"
        });

        const savedOrder = await newOrder.save();

        const customer = await User.findById(customerId);

        if (!customer) {
            return res.status(404).json('Customer not found');
        }

        await customer.updateOne({ $push: { orders: savedOrder._id } });

        const worker = await User.findById(workerId);

        if (!worker) {
            return res.status(404).json('Worker not found');
        }

        await worker.updateOne({ $push: { orders: savedOrder._id } })

        const notification = new Notification({
            sender: customerId,
            receiver: workerId,
            message: `${customer.firstName} booked one of your services.`,
            read: false,
        });

        await notification.save();

        if (userConnections.has(customerId)) {
            userConnections.get(customerId).emit('orderCreated', savedOrder);
        }
        if (userConnections.has(workerId)) {
            userConnections.get(workerId).emit('orderCreated', savedOrder);
        }

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

router.get('/get-all-orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

router.patch('/update-order', async (req, res) => {
    const { orderId, status, userId } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(
            orderId,
            { $set: { status } },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const cancellerId = userId.toString() === order.customerId.toString() ? order.customerId : order.workerId;
        const cancellerRole = userId.toString() === order.customerId.toString() ? 'customer' : 'worker';

        if (status === 'Canceled') {

            const notification = new Notification({
                sender: userId,
                receiver: cancellerId === order.customerId ? order.workerId : order.customerId,
                message: 'One of your appointments has been canceled.',
                read: false,
            });
            await notification.save();

            if (cancellerRole === "worker") {
                if (userConnections.has((order.customerId).toString())) {
                    userConnections.get((order.customerId).toString()).emit('orderDeleted', order);
                }
            } else if (cancellerRole === "customer") {
                if (userConnections.has((order.workerId).toString())) {
                    userConnections.get((order.workerId).toString()).emit('orderDeleted', order);
                }
            }
        }

        res.status(200).send('Order status updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});



module.exports = router;
