const express = require('express');
const app = express();
const User = require('../models/User');
const Rating = require('../models/Rating');
const Order = require('../models/Order');


app.post('/rate', async (req, res) => {
    try {
        const { workerId, customerId, orderId, stars } = req.body;

        if (!workerId || !customerId || !orderId || !stars) {
            return res.status(400).json('Missing required fields');
        }

        const worker = await User.findById(workerId);

        if (!worker) {
            return res.status(404).json('Worker not found');
        }

        const customer = await User.findById(customerId);

        if (!customer) {
            return res.status(404).json('Customer not found');
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json('Order not found');
        }

        const newRating = new Rating({
            workerId,
            customerId,
            orderId,
            stars,
        });

        await newRating.save();

        order.rating = stars;
        await order.save();


        res.status(200).send('Rating created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

app.get('/worker-rating/:workerId', async (req, res) => {
    try {
        const workerId = req.params.workerId;

        const worker = await User.findById(workerId);

        if (!worker) {
            return res.status(404).json('Worker not found');
        }

        const ratings = await Rating.find({ workerId });

        if (ratings.length === 0) {
            return res.status(200).json({ averageStars: 0 });
        }

        const totalStars = ratings.reduce((sum, rating) => sum + rating.stars, 0);
        const averageStars = totalStars / ratings.length;

        res.status(200).json({ rating: averageStars, reviews: ratings.length });
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

app.get('/customer-ratings/:customerId', async (req, res) => {
    try {
        const customerId = req.params.customerId;

        const customer = await User.findById(customerId);

        if (!customer) {
            return res.status(404).json('Customer not found');
        }
        const ratingsCount = await Rating.countDocuments({ customerId });
        res.status(200).json({ nrOfRatings: ratingsCount });
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

app.get('/workers-ratings', async (req, res) => {
    try {
        const workers = await User.find();

        const resultPromises = workers.map(async (worker) => {
            const workerRatings = await Rating.find({ workerId: worker._id });
            const totalStars = workerRatings.reduce((sum, rating) => sum + rating.stars, 0);
            const averageStars = workerRatings.length > 0 ? totalStars / workerRatings.length : 0;
            return {
                workerId: worker._id,
                rating: averageStars,
                reviews: workerRatings.length
            };
        });

        const result = await Promise.all(resultPromises);

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});


app.get('/', async (req, res) => {
    try {
        const ratings = await Rating.find();
        res.status(200).json(ratings);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

app.listen(process.env.PORT_RATING, () => {
    console.log(`Rating microservice listening on port ${process.env.PORT_RATING}`);
});

module.exports = app;
