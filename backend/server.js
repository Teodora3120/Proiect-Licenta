require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')
const http = require('http');
const authRoute = require("./routes/auth")
const workerRoute = require("./routes/worker")
const customerRoute = require('./routes/customer')
const serviceRoute = require('./routes/service')
const orderRoute = require('./routes/order')
const notificationRoute = require('./routes/notification')
const ratingRoute = require('./routes/rating')
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

    //routes
    app.use('/auth', authRoute);
    app.use('/worker', verifyToken, workerRoute)
    app.use('/customer', verifyToken, customerRoute)
    app.use('/service', verifyToken, serviceRoute)
    app.use('/order', verifyToken, orderRoute)
    app.use('/notification', verifyToken, notificationRoute)
    app.use('/rating', verifyToken, ratingRoute)

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


