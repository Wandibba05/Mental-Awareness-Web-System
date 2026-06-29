const express = require('express');
const router = express.Router();
const { getDashboardStats, getReportsData } = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardStats);
router.get('/reports', protect, getReportsData);

module.exports = router;