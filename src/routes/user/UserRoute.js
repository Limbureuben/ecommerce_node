const express = require('express');
const User = require('../../model/user/userModel');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authMiddleware = require('../../utils/authMiddleware');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
}

router.post('/register', async (req, res) => {
    const { email, role, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword ) {
        return res.status(400).json({
            message: 'Please enter all fields'
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Passwords do not match'
        });
    }

    try {
        
        const userExist = await User.findOne({ email });
        

        if (userExist) {
            return res.status(400).json({
                success: false,
                message: 'User already exist'
            });
        }

        // Create the user with hashed password
        const user = await User.create({
            email,
            role,
            password
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: {
                _id: user._id,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
        const safeUser = {
            id: user._id,
            email: user.email,
            role: user.role
        }
        res.status(200).json({
            success: true,
            user: safeUser,
            message: 'Login successfully',
            token: generateToken(user)
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            user: null,
            message: err.message
        });
    }
});



router.get('/get-all-users', async (req, res) => {
    try {
        const user = await User.find();

        res.status(200).json({
            success: true,
            users: user,
            message: 'Data fetched successfully'
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            users: null,
            message: 'User fetch failed', err
        });
    }
});


router.get('/profile', authMiddleware, (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'This is your profile',
        user: req.user
    });
});


module.exports = router