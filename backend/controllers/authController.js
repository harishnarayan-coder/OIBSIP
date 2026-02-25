const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user',
            isVerified: true // DEMO OVERRIDE: Automatically verify all accounts
        });

        // Skip email sending entirely for demo mode and return success
        res.status(201).json({
            message: 'Registration successful! Account auto-verified for testing.',
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) return res.status(401).json({ message: 'Please verify your email first' });
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const verificationToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({ verificationToken });
        if (!user) return res.status(400).json({ message: 'Invalid token' });

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        res.json({ message: 'Email verified successfully. You can now login.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: 'No user with that email' });

        const resetToken = user.getResetPasswordToken();
        await user.save();

        const resetUrl = process.env.FRONTEND_URL + '/resetpassword/' + resetToken;
        const message = 'Reset your password by clicking: ' + resetUrl;

        try {
            await sendEmail({ email: user.email, subject: 'Password Reset', message });
            res.status(200).json({ message: 'Email sent' });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });
        if (!user) return res.status(400).json({ message: 'Invalid token' });

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({ message: 'Password reset successful', token: generateToken(user._id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

module.exports = { registerUser, loginUser, verifyEmail, forgotPassword, resetPassword, getAllUsers };
