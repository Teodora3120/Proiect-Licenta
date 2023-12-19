const express = require('express');
const app = express();
const User = require('../models/User');
const Service = require('../models/Service');
const Order = require('../models/Order')

app.put('/update-account-details/:userId', async (req, res) => {
    try {
        const { lastName, address, description } = req.body;
        const userId = req.params.userId;

        if (!lastName || !description || !address || !userId) {
            return res.status(400).json('Missing required fields');
        }

        const worker = await User.findById(userId);

        if (!worker) {
            return res.status(404).json('User not found.');
        }

        worker.lastName = lastName;
        worker.address = address;
        worker.description = description;

        const updatedAccount = await worker.save();

        res.status(200).json(updatedAccount);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});


app.put('/save-domain/:userId', async (req, res) => {
    try {
        const { domain } = req.body;
        const userId = req.params.userId;

        if (!domain || !userId) {
            return res.status(400).json('Missing required fields');
        }

        const worker = await User.findById(userId);

        if (!worker) {
            return res.status(404).json('User not found.');
        }

        worker.domain = domain;

        const updatedAccount = await worker.save();

        res.status(200).json(updatedAccount.domain);
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

app.put('/send-schedule/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { schedule } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json('User not found');
        }

        user.schedule = schedule;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

app.get('/get-schedule-for-a-day/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const date = req.query.date;
        const day = req.query.day;
        const serviceId = req.query.serviceId;
        const worker = await User.findById(userId);

        if (!worker) {
            return res.status(404).json('User not found');
        }

        const scheduleForDay = worker.schedule.find(schedule => schedule.dayOfWeek === day);

        if (!scheduleForDay) {
            return res.status(404).json(`Worker doesn't have a schedule set for the selected day.`);
        }

        const ordersForDay = await Order.find({
            workerId: userId,
            date: date,
            status: 'On going'
        });


        const service = await Service.findById(serviceId);

        const availableTimeSlots = [];

        const scheduleStartTime = scheduleForDay.startTime;
        const scheduleEndTime = scheduleForDay.endTime;

        if (!ordersForDay.length) {

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

                // increment currentTime by one hour
                currentTime += 100;
            }

            return res.status(200).json(availableHours);
        }

        const occupiedHours = [];

        // calculate available time slots
        for (let i = 0; i < ordersForDay.length; i++) {
            const order = ordersForDay[i];
            const orderStartTime = order.start;
            const serviceOrder = await Service.findById(order.serviceId);
            const serviceOrderDuration = serviceOrder.duration;

            const orderHour = orderStartTime.split(":")[0];

            // calculate the orderEndTime
            let orderEndHour = Number(orderHour) + serviceOrderDuration;

            // add the occupied hours to the occupiedHours array
            for (let j = Number(orderHour); j < orderEndHour; j++) {
                occupiedHours.push(j);
            }
        }

        // calculate the gap after the last order (if any)
        const finalGap = {
            startTime: scheduleStartTime,
            endTime: scheduleEndTime,
        };

        // filter the available hours to exclude occupied hours
        const availableHours = [];

        const startTime = parseInt(scheduleStartTime.split(":")[0]);
        const endTime = parseInt(scheduleEndTime.split(":")[0]);

        let currentTime = String(startTime).padStart(2, '0'); // initialize as a string in "HH" format

        while (currentTime < endTime) {

            if (!occupiedHours.includes(parseInt(currentTime, 10))) {
                const formattedTime = `${currentTime}:00`;
                availableHours.push(formattedTime);
            }
            // increment currentTime by one hour (in the format HH)
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


app.get('/get-all-workers', async (req, res) => {
    try {
        const workers = await User.find({ type: "worker" });
        res.status(200).json(workers);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});


app.get('/get-worker-by-id/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json('Worker not found');
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

app.listen(process.env.PORT_WORKER, () => {
    console.log(`Worker microservice listening on port ${process.env.PORT_WORKER}`);
});

module.exports = app;
