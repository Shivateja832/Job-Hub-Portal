const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, upload.single('resume'), updateProfile);

module.exports = router;
