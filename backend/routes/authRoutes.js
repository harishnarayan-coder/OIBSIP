const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyEmail, forgotPassword, resetPassword, getAllUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
