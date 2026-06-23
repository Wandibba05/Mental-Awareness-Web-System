const MoodCheckIn = require('../models/MoodCheckIn');

// ───────────────────────────────
// CREATE a mood check-in
// ───────────────────────────────
const createMoodCheckIn = async (req, res) => {
  try {
    const { moodScore, moodLabel, tags, journalEntry } = req.body;
    const studentId = req.user.id; // comes from auth middleware

    const newEntry = await MoodCheckIn.create({
      student: studentId,
      moodScore,
      moodLabel,
      tags,
      journalEntry,
    });

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────
// GET mood history for logged in student
// ───────────────────────────────
const getMoodHistory = async (req, res) => {
  try {
    const studentId = req.user.id;

    const entries = await MoodCheckIn.find({ student: studentId })
      .sort({ createdAt: -1 })
      .limit(30);

    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createMoodCheckIn, getMoodHistory };