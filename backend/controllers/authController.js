const Student = require('../models/Student');
const Counsellor = require('../models/Counsellor');
const Admin = require('../models/Admin');
const generateToken = require('../middleware/generateToken');
const { sendTwoFactorCode } = require('../middleware/emailService');

// Map role names to their models
const getModel = (role) => {
  if (role === 'student') return Student;
  if (role === 'counsellor') return Counsellor;
  if (role === 'admin') return Admin;
  return null;
};

// ───────────────────────────────
// REGISTER
// ───────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { role, fullName, email, phoneNumber, password, specialisation } = req.body;

    const Model = getModel(role);
    if (!Model) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Check if user already exists
    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Build user data
    const userData = { fullName, email, phoneNumber, password };
    if (role === 'counsellor' && specialisation) {
      userData.specialisation = specialisation;
    }

    const newUser = await Model.create(userData);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role,
      status: newUser.status,
      token: generateToken(newUser._id, role),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────
// LOGIN
// ───────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { role, email, password } = req.body;

    const Model = getModel(role);
    if (!Model) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Find user by email
    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if account is disabled
    if (user.status === 'disabled') {
      return res.status(403).json({ message: 'Your account has been disabled. Please contact support.' });
    }

    // Check if counsellor account is still pending approval
    if (role === 'counsellor' && user.status === 'pending') {
      return res.status(403).json({ message: 'Your account is awaiting admin approval.' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // For admin — generate and send 2FA code to email
    if (role === 'admin') {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.twoFactorCode = code;
      user.twoFactorExpiry = expiry;
      await user.save();

      await sendTwoFactorCode(email, code);

      return res.status(200).json({
        message: '2FA code sent to your email. Please check your inbox.',
        requiresTwoFactor: true,
        email: email,
      });
    }

    // For student and counsellor — log in directly
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role,
      status: user.status,
      token: generateToken(user._id, role),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────
// VERIFY 2FA CODE (admin only)
// ───────────────────────────────
const verifyTwoFactor = async (req, res) => {
  try {
    const { email, code } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin account not found.' });
    }

    // Check if code has expired
    if (!admin.twoFactorExpiry || new Date() > admin.twoFactorExpiry) {
      return res.status(401).json({ message: 'Your verification code has expired. Please log in again.' });
    }

    // Check if code matches
    if (admin.twoFactorCode !== code) {
      return res.status(401).json({ message: 'Invalid verification code. Please try again.' });
    }

    // Clear the code after successful verification
    admin.twoFactorCode = '';
    admin.twoFactorExpiry = null;
    await admin.save();

    res.status(200).json({
      _id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      role: 'admin',
      status: admin.status,
      token: generateToken(admin._id, 'admin'),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser, verifyTwoFactor };