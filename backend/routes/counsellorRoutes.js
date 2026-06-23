const express = require('express');
const router = express.Router();
const {
  getActiveCounsellors,
  getAllCounsellors,
  updateCounsellorStatus,
} = require('../controllers/counsellorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/active', protect, getActiveCounsellors);
router.get('/all', protect, getAllCounsellors);
router.put('/:id/status', protect, updateCounsellorStatus);

module.exports = router;