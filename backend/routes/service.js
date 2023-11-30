const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const User = require('../models/User');


router.get('/get-all-services', async (req, res) => {
    try {
        const services = await Service.find();

        res.status(200).json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

router.post('/create-service', async (req, res) => {
    try {
        const { name, description, price, userId, domain, duration } = req.body;

        if (!name || !description || !price || !domain || !duration || !userId) {
            return res.status(400).json('Missing required fields');
        }

        const newService = new Service({
            name,
            description,
            domain,
            price,
            duration,
            user: userId
        });

        const savedService = await newService.save();

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json('User not found');
        }

        user.services.push(savedService._id);

        await user.save();

        res.status(201).json('Service created and added to user');
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});


router.put('/edit-service', async (req, res) => {
    try {
        const { name, description, price, duration, _id } = req.body;

        if (!name || !description || !price || !duration || !_id) {
            return res.status(400).json('Missing required fields');
        }

        const service = await Service.findById(_id);

        if (!service) {
            return res.status(404).json('Service not found');
        }

        service.name = name;
        service.description = description;
        service.price = price;
        service.duration = duration;

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


router.delete('/delete-all-services/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json('Missing user id.');
        }

        const result = await Service.deleteMany({ user: userId });

        if (result.deletedCount > 0) {
            await User.updateOne({ _id: userId }, { $set: { services: [] } });
            return res.status(200).json('Services deleted successfully');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

router.get('/get-services/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json('User not found');
        }

        const services = await Service.find({ user: userId });

        res.status(200).json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});


module.exports = router;
