const express = require('express');
const app = express();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, dateOfBirth, city, type, telephoneNumber } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json('Email already exists');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ firstName, lastName, email, password: hashedPassword, dateOfBirth, city, type, telephoneNumber });

        await newUser.save();

        res.status(201).json('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json('User not found');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json('Invalid credentials');
        }

        const payload = {
            id: user._id,
            email: user.email,
        };

        const token = jwt.sign(payload, jwtSecret, { expiresIn: '6h' });
        delete user._doc.password;
        delete user._doc.__v;

        const userToSend = { ...user._doc, token: token }

        return res.status(200).json(userToSend);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

app.listen(process.env.PORT_AUTH, () => {
    console.log(`Auth microservice listening on port ${process.env.PORT_AUTH}`);
});

module.exports = app;
