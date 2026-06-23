const express = require('express');
const router = express.Router();
const {
  createBooking,
  getStudentBookings,
  getCounsellorBookings,
  updateBookingStatus,
  getAllBookings,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/student', protect, getStudentBookings);
router.get('/counsellor', protect, getCounsellorBookings);
router.get('/all', protect, getAllBookings);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;