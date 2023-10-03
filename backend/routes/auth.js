const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// Route to handle user registration
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, age, city } = req.body;
        console.log(firstName, lastName, email, password, age, city)
        // Check if the email is already taken
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(403).json({ error: 'Email already exists' });
        }

        // Create a new user
        const newUser = new User({ firstName, lastName, email, password, age, city });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

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

        // If the passwords match, authentication is successful
        if (passwordMatch) {
            return res.status(200).json({ message: 'Login successful' });
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
