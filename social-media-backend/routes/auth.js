const express = require('express');
const router = express.Router();
const {register, login} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/register', register);

router.post('/login', login);

router.get('/profile',authMiddleware, (req, res) => {
    res.json({ message: 'Profile fetched successfully', user: req.user });
});


router.post('/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
    return res.json({ message: 'Logout successful' });
});


module.exports = router;