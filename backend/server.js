require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')
const http = require('http');
const authRoute = require("./microservices/auth")
const workerRoute = require("./microservices/worker")
const customerRoute = require('./microservices/customer')
const serviceRoute = require('./microservices/service')
const orderRoute = require('./microservices/order')
const notificationRoute = require('./microservices/notification')
const ratingRoute = require('./microservices/rating')
const supportQuestionRoute = require('./microservices/support-question')
const verifyToken = require('./utils/verifyToken')
const app = express();
const port = process.env.PORT || 5000;
const { Server } = require('socket.io');
const { userConnections } = require('./socketConnections');
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST']
    }
})


app.io = io;

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

    app.use('/auth', authRoute);
    app.use('/customer', verifyToken, customerRoute)
    app.use('/notification', verifyToken, notificationRoute)
    app.use('/order', verifyToken, orderRoute)
    app.use('/rating', verifyToken, ratingRoute)
    app.use('/service', verifyToken, serviceRoute)
    app.use('/support', verifyToken, supportQuestionRoute)
    app.use('/worker', verifyToken, workerRoute)

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        userConnections.set(userId, socket);

        console.log('New user connected', userId);

        socket.on('disconnect', () => {
            console.log('A user disconnected', userId);
            userConnections.delete(userId)
        });
    });

    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});


