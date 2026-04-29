const express = require('express');
const User = require('../../model/user/userModel');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authMiddleware = require('../../utils/authMiddleware');
const Product = require('../../model/product/productModel');
const sendEmail = require('../../utils/sendEmail');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
}

router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword ) {
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

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Create the user with hashed password and OTP
        const user = await User.create({
            username,
            email,
            password,
            otp,
            otpExpires
        });

        // Send OTP email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Email Verification OTP',
                message: `Your OTP for registration is: ${otp}. It expires in 10 minutes.`
            });

            res.status(201).json({
                success: true,
                message: 'Registration successful. Please check your email for OTP.',
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (mailErr) {
            console.error('Email sending failed:', mailErr);
            res.status(201).json({
                success: true,
                message: `Registration successful, but email failed: ${mailErr.message}`,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Email verified successfully. You can now login.'
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
        const user = await User.findOne({
            $or: [
                { email: email },
                { username: email }
            ]
        });
        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username/email or password'
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: 'Please verify your email before logging in'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username/email or password'
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



router.get('/get-all-users', authMiddleware, async (req, res) => {
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

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    return res.status(200).json({
        success: true,
        message: 'This is your profile',
        user: req.user
    });
});


router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "user"});

        const totalProduct = await Product.countDocuments();

        return res.status(200).json({
            success:true,
            totalUsers,
            totalProduct
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


module.exports = router