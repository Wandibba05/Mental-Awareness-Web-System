const express = require('express');
const router = express.Router();
const { createMoodCheckIn, getMoodHistory } = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createMoodCheckIn);
router.get('/history', protect, getMoodHistory);

module.exports = router;