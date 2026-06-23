const mongoose = require('mongoose');

const moodCheckInSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  moodScore: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  moodLabel: {
    type: String,
    enum: ['Terrible', 'Low', 'Okay', 'Good', 'Great'],
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  journalEntry: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('MoodCheckIn', moodCheckInSchema);