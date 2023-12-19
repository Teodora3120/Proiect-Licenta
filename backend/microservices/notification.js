const express = require('express');
const app = express();
const User = require('../models/User');
const Notification = require('../models/Notification')

app.get('/get-notifications-by-user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json('User not found');
        }

        const notifications = await Notification.find({ receiver: userId });

        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

app.put('/set-read-notification/:notificationId', async (req, res) => {
    try {
        const notificationId = req.params.notificationId;
        if (!notificationId) {
            return res.status(400).json('Missing required fields');
        }

        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json('Notification not found');
        }

        notification.read = true;

        const updatedNotification = await notification.save();

        res.status(200).json(updatedNotification);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
})

app.listen(process.env.PORT_NOTIFICATION, () => {
    console.log(`Notification microservice listening on port ${process.env.PORT_NOTIFICATION}`);
});

module.exports = app;