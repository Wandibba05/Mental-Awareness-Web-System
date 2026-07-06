const Student = require('../models/Student');
const Booking = require('../models/Booking');

// ───────────────────────────────
// GET all students (admin only)
// ───────────────────────────────


const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password');

    // Count bookings per student
    const studentsWithCounts = await Promise.all(
      students.map(async (s) => {
        const sessionCount = await Booking.countDocuments({ student: s._id });
        return { ...s.toObject(), sessionCount };
      })
    );

    res.status(200).json(studentsWithCounts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────
// UPDATE student status (admin enable/disable)
// ───────────────────────────────
const updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const student = await Student.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllStudents, updateStudentStatus };