const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Service = require('../models/Service');


router.put('/update-account-details/:userId', async (req, res) => {
    try {
        const { lastName, address } = req.body;
        const userId = req.params.userId;
        // Check if all required fields are present in the request body
        if (!lastName || !address || !userId) {
            return res.status(400).json('Missing required fields');
        }

        // Find the service by its ID
        const customer = await User.findById(userId);

        if (!customer) {
            return res.status(404).json('User not found.');
        }

        // Update the service object with the new values
        customer.lastName = lastName;
        customer.address = address;

        // Save the updated service document
        const updatedAccount = await customer.save();

        res.status(200).json(updatedAccount);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});


router.delete('/delete-account/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json('Missing user id.');
        }

        await User.findByIdAndRemove(userId);

        res.status(200).json('User deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
