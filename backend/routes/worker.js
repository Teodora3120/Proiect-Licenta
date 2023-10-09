const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Service = require('../models/Service');

router.post('/create-service', async (req, res) => {
    try {
        const { name, description, price, userId } = req.body;
        // Check if all required fields are present in the request body
        if (!name || !description || !price || !userId) {
            return res.status(400).json({ error: 'Missing required fields' });
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
            return res.status(404).json({ error: 'User not found' });
        }

        // Add the service's _id to the user's services array
        user.services.push(savedService._id);

        // Save the updated user document
        await user.save();

        res.status(201).json({ message: 'Service created and added to user' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.put('/edit-service', async (req, res) => {
    try {
        const { name, description, price, _id } = req.body;

        // Check if all required fields are present in the request body
        if (!name || !description || !price || !_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Find the service by its ID
        const service = await Service.findById(_id);

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        // Update the service object with the new values
        service.name = name;
        service.description = description;
        service.price = price;

        // Save the updated service document
        const updatedService = await service.save();

        res.status(200).json({ message: 'Service updated successfully', service: updatedService });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.delete('/delete-service/:serviceId', async (req, res) => {
    try {
        const serviceId = req.params.serviceId;

        console.log(serviceId)
        // Check if all required fields are present in the request body
        if (!serviceId) {
            return res.status(400).json({ error: 'Missing service id.' });
        }

        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        // Find the user associated with this service
        const userId = service.user;

        // Delete the service from the database
        await Service.findByIdAndRemove(serviceId);

        // Remove the service ID from the user's services array
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.services.pull(serviceId); // Remove the service ID from the array
        await user.save();

        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/get-services/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find services with the user's ID in the 'user' field
        const services = await Service.find({ user: userId });

        res.status(200).json({ services });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
