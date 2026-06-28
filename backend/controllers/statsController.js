const Student = require('../models/Student');
const Counsellor = require('../models/Counsellor');
const Booking = require('../models/Booking');
const MoodCheckIn = require('../models/MoodCheckIn');

// ───────────────────────────────
// GET overall system statistics (admin dashboard)
// ───────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCounsellors = await Counsellor.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalMoodCheckIns = await MoodCheckIn.countDocuments();

    // Recent activity — last 5 students, counsellors, and bookings combined
    const recentStudents = await Student.find().sort({ createdAt: -1 }).limit(3).select('fullName createdAt');
    const recentCounsellors = await Counsellor.find().sort({ createdAt: -1 }).limit(3).select('fullName status createdAt');
    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(3).populate('student', 'fullName').populate('counsellor', 'fullName');

    // Top counsellors by number of bookings
    const topCounsellorsAgg = await Booking.aggregate([
      { $group: { _id: '$counsellor', sessionCount: { $sum: 1 } } },
      { $sort: { sessionCount: -1 } },
      { $limit: 3 },
    ]);

    const topCounsellorIds = topCounsellorsAgg.map((t) => t._id);
    const topCounsellorsData = await Counsellor.find({ _id: { $in: topCounsellorIds } }).select('fullName specialisation');

    const topCounsellors = topCounsellorsAgg.map((agg) => {
      const counsellor = topCounsellorsData.find((c) => c._id.toString() === agg._id.toString());
      return {
        name: counsellor?.fullName || 'Unknown',
        specialisation: counsellor?.specialisation || 'General',
        sessions: agg.sessionCount,
      };
    });

    res.status(200).json({
      totalStudents,
      totalCounsellors,
      totalBookings,
      totalMoodCheckIns,
      recentStudents,
      recentCounsellors,
      recentBookings,
      topCounsellors,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDashboardStats };
// ───────────────────────────────
// GET detailed reports data (admin reports page)
// ───────────────────────────────
const getReportsData = async (req, res) => {
  try {
    // Session status breakdown
    const statusBreakdown = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Mood distribution (count of each mood label)
    const moodBreakdown = await MoodCheckIn.aggregate([
      { $group: { _id: '$moodLabel', count: { $sum: 1 } } },
    ]);

    // Sessions per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const sessionsPerMonth = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Top reasons for sessions — extract common words from reason field (simplified: count non-empty reasons grouped by sessionType for now)
    const topConcerns = await Booking.aggregate([
      { $match: { reason: { $ne: '' } } },
      { $group: { _id: '$sessionType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      statusBreakdown,
      moodBreakdown,
      sessionsPerMonth,
      topConcerns,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDashboardStats, getReportsData };