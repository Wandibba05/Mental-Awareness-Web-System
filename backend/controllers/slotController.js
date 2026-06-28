const AvailabilitySlot = require('../models/AvailabilitySlot');

// ───────────────────────────────
// GET all slots for the logged-in counsellor
// ───────────────────────────────
const getCounsellorSlots = async (req, res) => {
  try {
    const counsellorId = req.user.id;
    const slots = await AvailabilitySlot.find({ counsellor: counsellorId }).sort({ createdAt: 1 });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────
// GET open slots for a specific counsellor (for students booking)
// ───────────────────────────────
const getOpenSlotsForCounsellor = async (req, res) => {
  try {
    const { counsellorId } = req.params;
    const slots = await AvailabilitySlot.find({ counsellor: counsellorId, status: 'open' }).sort({ createdAt: 1 });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────
// CREATE a new slot
// ───────────────────────────────
const createSlot = async (req, res) => {
  try {
    const counsellorId = req.user.id;
    const { day, time } = req.body;

    const newSlot = await AvailabilitySlot.create({
      counsellor: counsellorId,
      day,
      time,
      status: 'open',
    });

    res.status(201).json(newSlot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────
// UPDATE a slot's status (block/unblock)
// ───────────────────────────────
const updateSlotStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const slot = await AvailabilitySlot.findById(id);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (slot.status === 'booked') {
      return res.status(400).json({ message: 'Cannot change status of a booked slot' });
    }

    slot.status = status;
    await slot.save();

    res.status(200).json(slot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────
// DELETE a slot
// ───────────────────────────────
const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await AvailabilitySlot.findById(id);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (slot.status === 'booked') {
      return res.status(400).json({ message: 'Cannot delete a slot that has a booking' });
    }

    await AvailabilitySlot.findByIdAndDelete(id);
    res.status(200).json({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getCounsellorSlots,
  getOpenSlotsForCounsellor,
  createSlot,
  updateSlotStatus,
  deleteSlot,
};