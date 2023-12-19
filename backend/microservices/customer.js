const express = require('express');
const app = express();
const User = require('../models/User');

app.put('/update-account-details/:userId', async (req, res) => {
    try {
        const { lastName, address } = req.body;
        const userId = req.params.userId;

        if (!lastName || !address || !userId) {
            return res.status(400).json('Missing required fields');
        }

        const customer = await User.findById(userId);

        if (!customer) {
            return res.status(404).json('User not found.');
        }

        customer.lastName = lastName;
        customer.address = address;

        const updatedAccount = await customer.save();

        res.status(200).json(updatedAccount);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});


app.delete('/delete-account/:userId', async (req, res) => {
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


app.get('/get-all-customers', async (req, res) => {
    try {
        const customers = await User.find({ type: "customer" });
        res.status(200).json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

app.get('/get-customer-by-id/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json('Customer not found');
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

app.listen(process.env.PORT_CUSTOMER, () => {
    console.log(`Customer microservice listening on port ${process.env.PORT_CUSTOMER}`);
});

module.exports = app;
