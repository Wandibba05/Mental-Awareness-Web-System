import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const loginUser = async (role, email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    role,
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
  return response.data;
};

// ───────────────────────────────
// MOOD CHECK-IN
// ───────────────────────────────

// Helper to get auth headers with the saved token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const saveMoodCheckIn = async (moodData) => {
  const response = await axios.post(`${API_BASE_URL}/mood`, moodData, getAuthHeaders());
  return response.data;
};

export const getMoodHistory = async () => {
  const response = await axios.get(`${API_BASE_URL}/mood/history`, getAuthHeaders());
  return response.data;
};
// ───────────────────────────────
// COUNSELLORS
// ───────────────────────────────

export const getActiveCounsellors = async () => {
  const response = await axios.get(`${API_BASE_URL}/counsellors/active`, getAuthHeaders());
  return response.data;
};

export const getAllCounsellorsAdmin = async () => {
  const response = await axios.get(`${API_BASE_URL}/counsellors/all`, getAuthHeaders());
  return response.data;
};

export const updateCounsellorStatus = async (id, status) => {
  const response = await axios.put(`${API_BASE_URL}/counsellors/${id}/status`, { status }, getAuthHeaders());
  return response.data;
};

// ───────────────────────────────
// BOOKINGS
// ───────────────────────────────

export const createBooking = async (bookingData) => {
  const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData, getAuthHeaders());
  return response.data;
};

export const getStudentBookings = async () => {
  const response = await axios.get(`${API_BASE_URL}/bookings/student`, getAuthHeaders());
  return response.data;
};

export const getCounsellorBookings = async () => {
  const response = await axios.get(`${API_BASE_URL}/bookings/counsellor`, getAuthHeaders());
  return response.data;
};

export const updateBookingStatus = async (id, status, notes) => {
  const response = await axios.put(`${API_BASE_URL}/bookings/${id}/status`, { status, notes }, getAuthHeaders());
  return response.data;
};

export const getAllBookingsAdmin = async () => {
  const response = await axios.get(`${API_BASE_URL}/bookings/all`, getAuthHeaders());
  return response.data;
};

// ───────────────────────────────
// STUDENTS (Admin)
// ───────────────────────────────

export const getAllStudentsAdmin = async () => {
  const response = await axios.get(`${API_BASE_URL}/students/all`, getAuthHeaders());
  return response.data;
};

export const updateStudentStatus = async (id, status) => {
  const response = await axios.put(`${API_BASE_URL}/students/${id}/status`, { status }, getAuthHeaders());
  return response.data;
};
// ───────────────────────────────
// ADMIN STATS
// ───────────────────────────────

export const getDashboardStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/stats/dashboard`, getAuthHeaders());
  return response.data;
};

export const getReportsData = async () => {
  const response = await axios.get(`${API_BASE_URL}/stats/reports`, getAuthHeaders());
  return response.data;
};

// ───────────────────────────────
// AVAILABILITY SLOTS
// ───────────────────────────────

export const getCounsellorSlots = async () => {
  const response = await axios.get(`${API_BASE_URL}/slots/mine`, getAuthHeaders());
  return response.data;
};

export const getOpenSlotsForCounsellor = async (counsellorId) => {
  const response = await axios.get(`${API_BASE_URL}/slots/counsellor/${counsellorId}`, getAuthHeaders());
  return response.data;
};

export const createSlot = async (day, time) => {
  const response = await axios.post(`${API_BASE_URL}/slots`, { day, time }, getAuthHeaders());
  return response.data;
};

export const updateSlotStatus = async (id, status) => {
  const response = await axios.put(`${API_BASE_URL}/slots/${id}/status`, { status }, getAuthHeaders());
  return response.data;
};

export const deleteSlot = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/slots/${id}`, getAuthHeaders());
  return response.data;
};