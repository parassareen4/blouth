const express = require('express');
const router = express.Router();
const {register, login} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');



router.post('/register', register);

router.post('/login', login);

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            username: user.username,
            email: user.email,
            // Add any other profile data you want to return
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/profile', authMiddleware, async (req, res) => {
    const { username, email } = req.body;
    
    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only update if values are provided
        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();

        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
    return res.json({ message: 'Logout successful' });
});


module.exports = router;