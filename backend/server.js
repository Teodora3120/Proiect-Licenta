require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')
const authRoute = require("./routes/auth")
const workerRoute = require("./routes/worker")
const customerRoute = require('./routes/customer')
const serviceRoute = require('./routes/service')
const orderRoute = require('./routes/order')
const verifyToken = require('./utils/verifyToken')
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect('mongodb://127.0.0.1:27017/db-licenta', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    console.log('Connected to MongoDB');
    app.use(cors());
    app.use(bodyParser.json())

    //routes
    app.use('/auth', authRoute);
    app.use('/worker', verifyToken, workerRoute)
    app.use('/customer', verifyToken, customerRoute)
    app.use('/service', verifyToken, serviceRoute)
    app.use('/order', verifyToken, orderRoute)

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});

