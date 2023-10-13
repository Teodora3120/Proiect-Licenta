const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const User = require('../models/User');
const Order = require('../models/Order');
const moment = require('moment-timezone');

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

router.get('/get-schedule-for-a-day/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const date = req.query.date;
        const day = req.query.day;
        const worker = await User.findById(userId);

        if (!worker) {
            return res.status(404).json('User not found');
        }

        // Get the user's schedule for the specified day
        const scheduleForDay = worker.schedule.find(schedule => schedule.dayOfWeek === day);

        if (!scheduleForDay) {
            return res.status(404).json('Schedule not found for the specified day');
        }

        // Get the user's orders for the specified day
        const ordersForDay = await Order.find({
            workerId: userId,
            date: date,
        });

        // Create an array to store available time slots
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

            availableTimeSlots.push(initialGap);
            return res.status(200).json(availableTimeSlots);
        }

        console.log(ordersForDay)
        // Calculate available time slots
        for (let i = 0; i < ordersForDay.length; i++) {
            const order = ordersForDay[i];
            const orderStartTime = moment.tz(`${order.date} ${order.startTime}`, 'Europe/Bucharest').toDate();
            const orderEndTime = moment.tz(`${order.date} ${order.endTime}`, 'Europe/Bucharest').toDate();

            // Calculate the gap between the current order and the next
            if (i < ordersForDay.length - 1) {
                const nextOrder = ordersForDay[i + 1];
                const gap = {
                    startTime: orderEndTime.toISOString(),
                    endTime: new Date(nextOrder.date + ' ' + nextOrder.startTime).toISOString(),
                };
                availableTimeSlots.push(gap);
            }

            // Update the schedule start time to the end of the current order
            scheduleStartTime.setTime(orderEndTime.getTime());
        }

        // Calculate the gap after the last order (if any)
        const finalGap = {
            startTime: scheduleStartTime,
            endTime: scheduleEndTime,
        };
        availableTimeSlots.push(finalGap);

        return res.status(200).json(availableTimeSlots);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});


module.exports = router;
