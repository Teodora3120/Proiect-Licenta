const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Service = require('../models/Service');

router.post('/create-service', async (req, res) => {
    try {
        const { name, description, price, userId } = req.body;
        // Check if all required fields are present in the request body
        if (!name || !description || !price || !userId) {
            return res.status(400).json('Missing required fields');
        }

        // Create a new service document
        const newService = new Service({
            name,
            description,
            price,
            user: userId
        });

        // Save the service document to the services collection
        const savedService = await newService.save();

        // Find the user by userId and update their services array
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json('User not found');
        }

        // Add the service's _id to the user's services array
        user.services.push(savedService._id);

        // Save the updated user document
        await user.save();

        res.status(201).json('Service created and added to user');
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});


router.put('/edit-service', async (req, res) => {
    try {
        const { name, description, price, _id } = req.body;

        // Check if all required fields are present in the request body
        if (!name || !description || !price || !_id) {
            return res.status(400).json('Missing required fields');
        }

        // Find the service by its ID
        const service = await Service.findById(_id);

        if (!service) {
            return res.status(404).json('Service not found');
        }

        // Update the service object with the new values
        service.name = name;
        service.description = description;
        service.price = price;

        // Save the updated service document
        const updatedService = await service.save();

        res.status(200).json(updatedService);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});



router.delete('/delete-service/:serviceId', async (req, res) => {
    try {
        const serviceId = req.params.serviceId;

        if (!serviceId) {
            return res.status(400).json('Missing service id.');
        }

        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json('Service not found');
        }

        const userId = service.user;

        await Service.findByIdAndRemove(serviceId);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json('User not found');
        }

        user.services.pull(serviceId);
        await user.save();

        res.status(200).json('Service deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});


router.get('/get-services/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json('User not found');
        }

        // Find services with the user's ID in the 'user' field
        const services = await Service.find({ user: userId });

        res.status(200).json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});


router.put('/update-account-details/:userId', async (req, res) => {
    try {
        const { lastName, age, address, description } = req.body;
        const userId = req.params.userId;
        // Check if all required fields are present in the request body
        if (!lastName || !description || !age || !address || !userId) {
            return res.status(400).json('Missing required fields');
        }

        // Find the service by its ID
        const worker = await User.findById(userId);

        if (!worker) {
            return res.status(404).json('User not found.');
        }

        // Update the service object with the new values
        worker.lastName = lastName;
        worker.age = age;
        worker.address = address;
        worker.description = description;

        // Save the updated service document
        const updatedAccount = await worker.save();

        res.status(200).json(updatedAccount);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});


router.put('/save-domain/:userId', async (req, res) => {
    try {
        const { domain } = req.body;
        const userId = req.params.userId;
        // Check if all required fields are present in the request body
        if (!domain || !userId) {
            return res.status(400).json('Missing required fields');
        }

        // Find the service by its ID
        const worker = await User.findById(userId);

        if (!worker) {
            return res.status(404).json('User not found.');
        }

        // Update the service object with the new values
        worker.domain = domain;

        // Save the updated service document
        const updatedAccount = await worker.save();

        res.status(200).json(updatedAccount.domain);
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
