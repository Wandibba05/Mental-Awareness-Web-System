const express = require('express');
const router = express.Router();
const { getAllStudents, updateStudentStatus } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/all', protect, getAllStudents);
router.put('/:id/status', protect, updateStudentStatus);

module.exports = router;