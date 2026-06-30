const Booking = require('../models/Booking');
const AvailabilitySlot = require('../models/AvailabilitySlot');

// ───────────────────────────────
// CREATE a new booking (student)
// ───────────────────────────────
const createBooking = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { counsellor, sessionType, reason, day, time } = req.body;

    // Find the matching open slot for this counsellor/day/time
    const slot = await AvailabilitySlot.findOne({
      counsellor,
      day,
      time,
      status: 'open',
    });

    const newBooking = await Booking.create({
      student: studentId,
      counsellor,
      slot: slot ? slot._id : undefined,
      sessionType,
      reason,
      day,
      time,
      status: 'pending',
    });

    // Mark the slot as booked if we found one
    if (slot) {
      slot.status = 'booked';
      await slot.save();
    }

    const populatedBooking = await newBooking.populate('counsellor', 'fullName specialisation');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────
// GET bookings for the logged in student
// ───────────────────────────────
const getStudentBookings = async (req, res) => {
  try {
    const studentId = req.user.id;

    const bookings = await Booking.find({ student: studentId })
      .populate('counsellor', 'fullName specialisation')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────
// GET bookings for the logged in counsellor
// ───────────────────────────────
const getCounsellorBookings = async (req, res) => {
  try {
    const counsellorId = req.user.id;

    const bookings = await Booking.find({ counsellor: counsellorId })
      .populate('student', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────
// UPDATE booking status (counsellor approves/rejects/reschedules)
// ───────────────────────────────
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData = { status };
    if (notes !== undefined) updateData.notes = notes;

    const booking = await Booking.findByIdAndUpdate(id, updateData, { new: true })
      .populate('student', 'fullName email')
      .populate('counsellor', 'fullName specialisation');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // If the booking was rejected/cancelled, free up the slot again
    if ((status === 'cancelled' || status === 'rescheduled') && booking.slot) {
      await AvailabilitySlot.findByIdAndUpdate(booking.slot, { status: 'open' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────
// GET all bookings (admin only)
// ───────────────────────────────
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('student', 'fullName email')
      .populate('counsellor', 'fullName specialisation')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBooking,
  getStudentBookings,
  getCounsellorBookings,
  updateBookingStatus,
  getAllBookings,
};