const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Service = require('../models/Service');
const Order = require('../models/Order')

router.put('/update-account-details/:userId', async (req, res) => {
    try {
        const { lastName, address, description } = req.body;
        const userId = req.params.userId;
        // Check if all required fields are present in the request body
        if (!lastName || !description || !address || !userId) {
            return res.status(400).json('Missing required fields');
        }

        // Find the service by its ID
        const worker = await User.findById(userId);

        if (!worker) {
            return res.status(404).json('User not found.');
        }

        // Update the service object with the new values
        worker.lastName = lastName;
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

router.put('/send-schedule/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { schedule } = req.body;

        // Check if the user exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json('User not found');
        }

        // Update the user's schedule
        user.schedule = schedule;

        // Save the updated user document
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

router.get('/get-schedule-for-a-day/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const date = req.query.date;
        const day = req.query.day;
        const serviceId = req.query.serviceId;
        const worker = await User.findById(userId);

        if (!worker) {
            return res.status(404).json('User not found');
        }

        // Get the user's schedule for the specified day
        const scheduleForDay = worker.schedule.find(schedule => schedule.dayOfWeek === day);

        if (!scheduleForDay) {
            return res.status(404).json(`Worker doesn't have a schedule set for the selected day.`);
        }

        // Get the user's orders for the specified day
        const ordersForDay = await Order.find({
            workerId: userId,
            date: date,
        });

        const service = await Service.findById(serviceId);

        const availableTimeSlots = [];

        // Convert schedule start and end times to Date objects
        const scheduleStartTime = scheduleForDay.startTime;
        const scheduleEndTime = scheduleForDay.endTime;

        if (!ordersForDay.length) {
            // Calculate the initial gap before the first order (if any)
            const initialGap = {
                startTime: scheduleStartTime,
                endTime: scheduleEndTime,
            };

            const startTime = parseInt(initialGap.startTime.replace(":", ""), 10);
            const endTime = parseInt(initialGap.endTime.replace(":", ""), 10);
            const availableHours = [];

            let currentTime = startTime;
            while (currentTime < endTime) {
                const formattedTime = `${String(currentTime).padStart(4, '0').slice(0, 2)}:${String(currentTime).padStart(4, '0').slice(-2)}`;
                availableHours.push(formattedTime);

                // Increment currentTime by one hour (in the format HHMM)
                currentTime += 100;
            }

            return res.status(200).json(availableHours);
        }

        // Create an array to store occupied hours
        const occupiedHours = [];

        // Calculate available time slots
        for (let i = 0; i < ordersForDay.length; i++) {
            const order = ordersForDay[i];
            const orderStartTime = order.start;
            const serviceOrder = await Service.findById(order.serviceId);
            const serviceOrderDuration = serviceOrder.duration;

            // Split the orderStartTime into hours and minutes
            const orderHour = orderStartTime.split(":")[0];

            // Calculate the orderEndTime
            let orderEndHour = Number(orderHour) + serviceOrderDuration;

            // Add the occupied hours to the occupiedHours array
            for (let j = Number(orderHour); j < orderEndHour; j++) {
                occupiedHours.push(j);
            }
        }

        // Calculate the gap after the last order (if any)
        const finalGap = {
            startTime: scheduleStartTime,
            endTime: scheduleEndTime,
        };

        // Filter the available hours to exclude occupied hours
        const availableHours = [];

        const startTime = parseInt(scheduleStartTime.split(":")[0]);
        const endTime = parseInt(scheduleEndTime.split(":")[0]);

        let currentTime = String(startTime).padStart(2, '0'); // Initialize as a string in "HH" format

        while (currentTime < endTime) {

            if (!occupiedHours.includes(parseInt(currentTime, 10))) {
                const formattedTime = `${currentTime}:00`;
                availableHours.push(formattedTime);
            }
            // Increment currentTime by one hour (in the format HH)
            const nextHour = parseInt(currentTime, 10) + 1;
            currentTime = String(nextHour).padStart(2, '0');
        }

        availableTimeSlots.push(finalGap);

        return res.status(200).json(availableHours);

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
