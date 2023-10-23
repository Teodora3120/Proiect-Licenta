const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification')

router.get('/get-notifications-by-user/:userId', async (req, res) => {
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

module.exports = router;