const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
require('dotenv').config();

// Route to handle user registration
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, age, city, type } = req.body;
        // Check if the email is already taken
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(403).json({ error: 'Email already exists' });
        }

        // Create a new user
        const newUser = new User({ firstName, lastName, email, password, age, city, type });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const jwtSecret = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find the user by email
        const user = await User.findOne({ email });
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        // If the passwords match, generate a JWT token and send it in the response
        if (passwordMatch === true) {
            // Create a JWT payload with user information (you can customize this payload)
            const payload = {
                id: user._id,
                email: user.email,
            };
            // Generate a JWT token with the payload and secret key
            const token = jwt.sign(payload, jwtSecret, { expiresIn: '2h' });
            delete user._doc.password;
            delete user._doc.__v;
            // Send the JWT token in the response
            return res.status(200).json({ message: 'Login successful', user: { ...user._doc, token: token } });
        } else if (passwordMatch === false) {
            console.log("Pass not match")
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports = router;
