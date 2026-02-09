const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        console.log('📝 Register request received with body:', req.body);
        const { firstName, lastName, email, password, phoneNumber, dob, gender } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        // Create new user
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            dob,
            gender
        });
        
        console.log('✅ User created successfully:', newUser);
        res.status(201).json({ 
            success: true, 
            message: "User registered successfully!",
            user: newUser
        });
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        // Verify password
        const isMatch = await User.verifyPassword(password, user.Upassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Wrong password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.Uid, role: user.Urole },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ 
            success: true, 
            message: "Login successful",
            token,
            user: {
                userId: user.Uid,
                firstName: user.Ufirst_name,
                lastName: user.Ulast_name,
                email: user.Uemail,
                role: user.Urole
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;