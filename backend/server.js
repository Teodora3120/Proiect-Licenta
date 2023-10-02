const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')
const authRoute = require("./routes/auth")
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

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});

