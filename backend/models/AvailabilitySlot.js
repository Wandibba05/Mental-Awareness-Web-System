const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema({
  counsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counsellor',
    required: true,
  },
  day: {
    type: String,
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'booked', 'blocked'],
    default: 'open',
  },
}, { timestamps: true });

module.exports = mongoose.model('AvailabilitySlot', availabilitySlotSchema);