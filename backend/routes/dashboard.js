const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const User = require('../models/User');

router.get('/get-all-services', async (req, res) => {
    try {
        // Find services with the user's ID in the 'user' field
        const services = await Service.find();

        res.status(200).json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});


router.get('/get-all-workers', async (req, res) => {
    try {
        const workers = await User.find({ type: "worker" });
        res.status(200).json(workers);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

module.exports = router;
