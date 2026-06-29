import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import CounsellorDashboard from './pages/CounsellorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MoodCheckIn from './pages/MoodCheckIn';
import SessionBooking from './pages/SessionBooking';
import Resources from './pages/Resources';
import CounsellorSessions from './pages/CounsellorSessions';
import CounsellorSlots from './pages/CounsellorSlots';
import CounsellorProfile from './pages/CounsellorProfile';
import AdminUsers from './pages/AdminUsers';
import AdminReports from './pages/AdminReports';
import AdminJournals from './pages/AdminJournals';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/mood" element={<MoodCheckIn />} />
        <Route path="/counsellor/dashboard" element={<CounsellorDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/student/sessions" element={<SessionBooking />} />
        <Route path="/student/resources" element={<Resources />} />
        <Route path="/counsellor/sessions" element={<CounsellorSessions />} />
<Route path="/counsellor/slots" element={<CounsellorSlots />} />
<Route path="/counsellor/notes" element={<CounsellorSlots />} />
<Route path="/counsellor/profile" element={<CounsellorProfile />} />
<Route path="/admin/users" element={<AdminUsers />} />
<Route path="/admin/reports" element={<AdminReports />} />
<Route path="/admin/journals" element={<AdminJournals />} />
      </Routes>
    </Router>
  );
}

export default App;

