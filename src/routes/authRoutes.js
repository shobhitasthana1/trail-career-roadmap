const express = require('express');
const { register, login, googleLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe); // protected — must send Bearer token

module.exports = router;
