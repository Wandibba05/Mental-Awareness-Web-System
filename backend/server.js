const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Mental Health Awareness API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/mood', require('./routes/moodRoutes'));
app.use('/api/counsellors', require('./routes/counsellorRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/slots', require('./routes/slotRoutes'));
app.use('/api/journals', require('./routes/journalRoutes'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});