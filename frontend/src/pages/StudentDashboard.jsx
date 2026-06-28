import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getStudentBookings, getMoodHistory } from '../api';
import '../styles/StudentDashboard.css';

const moodEmojis = {
  Terrible: { emoji: '😞', color: '#ef4444', score: 1 },
  Low:      { emoji: '😕', color: '#f97316', score: 2 },
  Okay:     { emoji: '😐', color: '#eab308', score: 3 },
  Good:     { emoji: '🙂', color: '#22c55e', score: 4 },
  Great:    { emoji: '😄', color: '#3b82f6', score: 5 },
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeNotif, setActiveNotif] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsData, moodData] = await Promise.all([
          getStudentBookings(),
          getMoodHistory(),
        ]);
        setBookings(bookingsData);

        // Take the 7 most recent entries and reverse so oldest is first (left to right)
        const recentMoods = moodData.slice(0, 7).reverse().map((m) => ({
          day: new Date(m.createdAt).toLocaleDateString('en-KE', { weekday: 'short' }),
          score: moodEmojis[m.moodLabel]?.score || 3,
          label: m.moodLabel,
          emoji: moodEmojis[m.moodLabel]?.emoji || '😐',
          color: moodEmojis[m.moodLabel]?.color || '#98a2b3',
        }));
        setMoodHistory(recentMoods);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date().toLocaleDateString('en-KE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const maxScore = 5;

  // Build notifications dynamically from real bookings
  const notifications = bookings.slice(0, 3).map((b) => ({
    id: b._id,
    type: 'session',
    message: `Your session with ${b.counsellor?.fullName || 'your counsellor'} is ${b.status} for ${b.day} at ${b.time}`,
    time: new Date(b.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }),
    icon: '📅',
  }));

  // Find the next upcoming confirmed/pending session
  const upcomingSession = bookings.find((b) => b.status === 'confirmed' || b.status === 'pending');

  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const upcomingCount = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length;

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div style={{ padding: '40px', textAlign: 'center', color: '#667085' }}>Loading dashboard...</div>
        </main>
      </div>
    );
  }

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
              <div><div className="stat-value">{upcomingCount}</div><div className="stat-label">Upcoming sessions</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#d1fae5' }}>✅</div>
              <div><div className="stat-value">{completedCount}</div><div className="stat-label">Sessions completed</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7' }}>🧠</div>
              <div><div className="stat-value">{moodHistory.length}</div><div className="stat-label">Mood check-ins</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#f3e8ff' }}>📚</div>
              <div><div className="stat-value">0</div><div className="stat-label">Resources read</div></div>
            </div>
          </div>

          {/* Mood history chart */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">📊 Mood history — this week</div>
              <button className="card-link" onClick={() => navigate('/student/mood')}>Log today →</button>
            </div>
            {moodHistory.length === 0 ? (
              <p style={{ color: '#98a2b3', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                No mood entries yet.{' '}
                <button
                  onClick={() => navigate('/student/mood')}
                  style={{ color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                >
                  Log your first mood
                </button>
              </p>
            ) : (
              <>
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
              </>
            )}
          </div>

          <div className="dashboard-bottom-row">

            {/* Upcoming session */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">📅 Upcoming session</div>
                <button className="card-link" onClick={() => navigate('/student/sessions')}>View all →</button>
              </div>
              {upcomingSession ? (
                <>
                  <div className="session-card">
                    <div className="session-avatar">
                      {(upcomingSession.counsellor?.fullName || 'NA').split(' ').map((n) => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="session-info">
                      <div className="session-name">{upcomingSession.counsellor?.fullName || 'Counsellor'}</div>
                      <div className="session-detail">📅 {upcomingSession.day}</div>
                      <div className="session-detail">🕘 {upcomingSession.time} · {upcomingSession.sessionType}</div>
                      <span className={`session-badge ${upcomingSession.status === 'confirmed' ? 'confirmed' : 'pending'}`}>
                        {upcomingSession.status === 'confirmed' ? 'Confirmed' : 'Pending approval'}
                      </span>
                    </div>
                  </div>
                  <button className="btn-primary" style={{ marginTop: '12px', width: '100%' }} onClick={() => navigate('/student/sessions')}>
                    📅 Book a new session
                  </button>
                </>
              ) : (
                <>
                  <p style={{ color: '#98a2b3', fontSize: '13px', padding: '10px 0' }}>You have no upcoming sessions booked.</p>
                  <button className="btn-primary" style={{ width: '100%' }} onClick={() => navigate('/student/sessions')}>
                    📅 Book a session
                  </button>
                </>
              )}
            </div>

            {/* Notifications */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">🔔 Notifications</div>
                <span className="notif-badge">{notifications.length}</span>
              </div>
              {notifications.length === 0 ? (
                <p style={{ color: '#98a2b3', fontSize: '13px', padding: '10px 0' }}>No notifications yet.</p>
              ) : (
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
              )}
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