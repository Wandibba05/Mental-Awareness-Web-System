const Journal = require('../models/Journal');

// ───────────────────────────────
// GET all approved journals (public — for the journals tab)
// ───────────────────────────────
const getApprovedJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ status: 'approved' })
      .populate('student', 'fullName')
      .sort({ createdAt: -1 });

    // Hide the real name if the journal was submitted anonymously
    const result = journals.map((j) => ({
      _id: j._id,
      title: j.title,
      category: j.category,
      storyText: j.storyText,
      rating: j.rating,
      author: j.isAnonymous ? 'Anonymous' : (j.student?.fullName || 'Anonymous'),
      createdAt: j.createdAt,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────
// CREATE a new journal/story (student submits)
// ───────────────────────────────
const createJournal = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { title, category, storyText, rating, isAnonymous } = req.body;

    const newJournal = await Journal.create({
      student: studentId,
      title,
      category,
      storyText,
      rating,
      isAnonymous,
      status: 'pending',
    });

    res.status(201).json(newJournal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────
// GET all journals (admin only — for moderation)
// ───────────────────────────────
const getAllJournals = async (req, res) => {
  try {
    const journals = await Journal.find()
      .populate('student', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json(journals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────
// UPDATE journal status (admin approves/rejects)
// ───────────────────────────────
const updateJournalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const journal = await Journal.findByIdAndUpdate(id, { status }, { new: true });

    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json(journal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getApprovedJournals, createJournal, getAllJournals, updateJournalStatus };