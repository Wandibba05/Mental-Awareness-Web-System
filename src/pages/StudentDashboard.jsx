import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/StudentDashboard.css';

// Mock mood history data — replace with real API data later
const moodHistory = [
  { day: 'Mon', score: 2, label: 'Low',   emoji: '😕', color: '#f97316' },
  { day: 'Tue', score: 4, label: 'Good',  emoji: '🙂', color: '#22c55e' },
  { day: 'Wed', score: 3, label: 'Okay',  emoji: '😐', color: '#eab308' },
  { day: 'Thu', score: 5, label: 'Great', emoji: '😄', color: '#3b82f6' },
  { day: 'Fri', score: 3, label: 'Okay',  emoji: '😐', color: '#eab308' },
  { day: 'Sat', score: 4, label: 'Good',  emoji: '🙂', color: '#22c55e' },
  { day: 'Sun', score: 4, label: 'Good',  emoji: '🙂', color: '#22c55e' },
];

const notifications = [
  { id: 1, type: 'session',  message: 'Your session with Dr. Amina Kariuki is confirmed for Tuesday 10 June at 9:00 AM', time: '2 hours ago', icon: '📅' },
  { id: 2, type: 'mood',     message: 'You have not logged your mood today. How are you feeling?',                       time: '5 hours ago', icon: '🧠' },
  { id: 3, type: 'resource', message: 'New article added: "5 techniques to manage exam anxiety"',                        time: '1 day ago',   icon: '📚' },
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeNotif, setActiveNotif] = useState(null);

  const today = new Date().toLocaleDateString('en-KE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const maxScore = 5;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">

        {/* Top bar */}
        <div className="dashboard-topbar">
          <div>
            <h1 className="dashboard-heading">Good morning 👋</h1>
            <p className="dashboard-date">{today}</p>
          </div>
          <button className="topbar-mood-btn" onClick={() => navigate('/student/mood')}>
            🧠 Log today's mood
          </button>
        </div>

        <div className="dashboard-grid">

          {/* Welcome banner */}
          <div className="welcome-banner">
            <div className="welcome-text">
              <h2>How are you doing today?</h2>
              <p>Your mental health matters. Take a moment to check in with yourself and book a session if you need support.</p>
              <div className="welcome-actions">
                <button className="btn-primary" onClick={() => navigate('/student/mood')}>🧠 Check in now</button>
                <button className="btn-secondary" onClick={() => navigate('/student/sessions')}>📅 Book a session</button>
              </div>
            </div>
            <div className="welcome-emoji">🌱</div>
          </div>

          {/* Stats row */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dbeafe' }}>📅</div>
              <div><div className="stat-value">2</div><div className="stat-label">Upcoming sessions</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#d1fae5' }}>✅</div>
              <div><div className="stat-value">5</div><div className="stat-label">Sessions completed</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7' }}>🧠</div>
              <div><div className="stat-value">7</div><div className="stat-label">Mood check-ins</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#f3e8ff' }}>📚</div>
              <div><div className="stat-value">4</div><div className="stat-label">Resources read</div></div>
            </div>
          </div>

          {/* Mood history chart */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">📊 Mood history — this week</div>
              <button className="card-link" onClick={() => navigate('/student/mood')}>Log today →</button>
            </div>
            <div className="mood-chart">
              {moodHistory.map((entry, index) => (
                <div key={index} className="chart-col">
                  <div className="chart-emoji">{entry.emoji}</div>
                  <div className="chart-bar-wrap">
                    <div className="chart-bar" style={{ height: `${(entry.score / maxScore) * 100}%`, background: entry.color }} />
                  </div>
                  <div className="chart-day">{entry.day}</div>
                  <div className="chart-label" style={{ color: entry.color }}>{entry.label}</div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <span style={{ color: '#ef4444' }}>😞 Terrible</span>
              <span style={{ color: '#f97316' }}>😕 Low</span>
              <span style={{ color: '#eab308' }}>😐 Okay</span>
              <span style={{ color: '#22c55e' }}>🙂 Good</span>
              <span style={{ color: '#3b82f6' }}>😄 Great</span>
            </div>
          </div>

          <div className="dashboard-bottom-row">

            {/* Upcoming session */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">📅 Upcoming session</div>
                <button className="card-link" onClick={() => navigate('/student/sessions')}>View all →</button>
              </div>
              <div className="session-card">
                <div className="session-avatar">AK</div>
                <div className="session-info">
                  <div className="session-name">Dr. Amina Kariuki</div>
                  <div className="session-detail">📅 Tuesday, 10 June 2026</div>
                  <div className="session-detail">🕘 9:00 AM · 50 min · Video call</div>
                  <span className="session-badge confirmed">Confirmed</span>
                </div>
              </div>
              <button className="btn-primary" style={{ marginTop: '12px', width: '100%' }} onClick={() => navigate('/student/sessions')}>
                📅 Book a new session
              </button>
            </div>

            {/* Notifications */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">🔔 Notifications</div>
                <span className="notif-badge">{notifications.length}</span>
              </div>
              <div className="notif-list">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`notif-item ${activeNotif === notif.id ? 'active' : ''}`} onClick={() => setActiveNotif(notif.id)}>
                    <span className="notif-icon">{notif.icon}</span>
                    <div className="notif-content">
                      <div className="notif-message">{notif.message}</div>
                      <div className="notif-time">{notif.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Help strip */}
          <div className="help-strip">
            <span className="help-strip-icon">🆘</span>
            <div>
              <div className="help-strip-title">Feeling overwhelmed? You are not alone.</div>
              <div className="help-strip-sub">Kenya crisis helpline: 0800 723 253 · Available 24/7</div>
            </div>
            <div className="help-strip-actions">
              <a href="tel:0800723253" className="help-call-btn">📞 Call now</a>
              <button className="help-chat-btn" onClick={() => navigate('/student/sessions')}>💬 Chat with counsellor</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;