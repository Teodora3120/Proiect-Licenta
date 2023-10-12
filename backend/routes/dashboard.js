const express = require('express');
const router = express.Router();
const Service = require('../models/Service');


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

module.exports = router;
