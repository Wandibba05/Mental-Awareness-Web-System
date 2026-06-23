const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const counsellorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  specialisation: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  profileImagePath: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'disabled'],
    default: 'pending',
  },
}, { timestamps: true });

// Hash password before saving
counsellorSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
counsellorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Counsellor', counsellorSchema);