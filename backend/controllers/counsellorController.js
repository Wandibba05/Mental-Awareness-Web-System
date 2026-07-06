const Counsellor = require('../models/Counsellor');
const Booking = require('../models/Booking');

// ───────────────────────────────
// GET all active counsellors (for students to browse and book)
// ───────────────────────────────
const getActiveCounsellors = async (req, res) => {
  try {
    const counsellors = await Counsellor.find({ status: 'active' }).select('-password');
    res.status(200).json(counsellors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────
// GET all counsellors (for admin — includes pending/disabled)
// ───────────────────────────────
const getAllCounsellors = async (req, res) => {
  try {
    const counsellors = await Counsellor.find().select('-password');

    // Count bookings per counsellor
    const counsellorsWithCounts = await Promise.all(
      counsellors.map(async (c) => {
        const sessionCount = await Booking.countDocuments({ counsellor: c._id });
        return { ...c.toObject(), sessionCount };
      })
    );

    res.status(200).json(counsellorsWithCounts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────
// UPDATE counsellor status (admin only — approve/disable)
// ───────────────────────────────
const updateCounsellorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const counsellor = await Counsellor.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-password');

    if (!counsellor) {
      return res.status(404).json({ message: 'Counsellor not found' });
    }

    res.status(200).json(counsellor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getActiveCounsellors, getAllCounsellors, updateCounsellorStatus };