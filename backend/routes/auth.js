const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

// Route to handle user registration
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, dateOfBirth, city, type, telephoneNumber } = req.body;
        // Check if the email is already taken
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json('Email already exists');
        }

        // Hash the password using bcrypt
        const saltRounds = 10; // You can adjust this as needed
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Create a new user
        const newUser = new User({ firstName, lastName, email, password: hashedPassword, dateOfBirth, city, type, telephoneNumber });

        // Save the user to the database
        await newUser.save();

        res.status(201).json('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find the user by email
        const user = await User.findOne({ email });
        // Check if the user exists
        if (!user) {
            return res.status(404).json('User not found');
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log("Pass not match")
            return res.status(401).json('Invalid credentials');
        }
        // If the passwords match, generate a JWT token and send it in the response
        // Create a JWT payload with user information (you can customize this payload)
        const payload = {
            id: user._id,
            email: user.email,
        };
        // Generate a JWT token with the payload and secret key
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '6h' });
        delete user._doc.password;
        delete user._doc.__v;

        const userToSend = { ...user._doc, token: token }
        // Send the JWT token in the response
        return res.status(200).json(userToSend);
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
});


module.exports = router;
