const express = require('express');
const router = express.Router();
const {
  getCounsellorSlots,
  getOpenSlotsForCounsellor,
  createSlot,
  updateSlotStatus,
  deleteSlot,
} = require('../controllers/slotController');
const { protect } = require('../middleware/authMiddleware');

router.get('/mine', protect, getCounsellorSlots);
router.get('/counsellor/:counsellorId', protect, getOpenSlotsForCounsellor);
router.post('/', protect, createSlot);
router.put('/:id/status', protect, updateSlotStatus);
router.delete('/:id', protect, deleteSlot);

module.exports = router;