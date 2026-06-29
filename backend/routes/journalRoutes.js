const express = require('express');
const router = express.Router();
const {
  getApprovedJournals,
  createJournal,
  getAllJournals,
  updateJournalStatus,
} = require('../controllers/journalController');
const { protect } = require('../middleware/authMiddleware');

router.get('/approved', protect, getApprovedJournals);
router.post('/', protect, createJournal);
router.get('/all', protect, getAllJournals);
router.put('/:id/status', protect, updateJournalStatus);

module.exports = router;