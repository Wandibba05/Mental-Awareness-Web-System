const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyTwoFactor } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-2fa', verifyTwoFactor);

module.exports = router;