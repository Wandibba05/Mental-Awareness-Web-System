import React from 'react';
import { useNavigate } from 'react-router-dom';
import CounsellorSidebar from '../components/CounsellorSidebar';
import '../styles/CounsellorDashboard.css';
import '../styles/CounsellorSidebar.css';

const stats = [
  { icon: '📅', label: 'Sessions today',    value: '3',  bg: '#dbeafe', },
  { icon: '⏳', label: 'Pending approvals', value: '4',  bg: '#fef3c7', },
  { icon: '✅', label: 'Completed',         value: '8',  bg: '#d1fae5', },
  { icon: '⭐', label: 'Avg. rating',       value: '4.8',bg: '#f3e8ff', },
];

const upcomingSessions = [
  { id: 1, name: 'James Mwangi',  topic: 'Anxiety',    type: 'Video',     time: '9:00 AM',  day: 'Today',     status: 'confirmed', avatar: 'JM' },
  { id: 2, name: 'Sara Mutua',    topic: 'Depression', type: 'In-person', time: '11:00 AM', day: 'Today',     status: 'pending',   avatar: 'SM' },
  { id: 3, name: 'Aisha Omar',    topic: 'Stress',     type: 'Video',     time: '2:00 PM',  day: 'Tomorrow',  status: 'confirmed', avatar: 'AO' },
];

const weekDays = [
  { day: 'Mon', date: '9',  sessions: 2, color: '#d1fae5' },
  { day: 'Tue', date: '10', sessions: 3, color: '#dbeafe', today: true },
  { day: 'Wed', date: '11', sessions: 1, color: '#fef3c7' },
  { day: 'Thu', date: '12', sessions: 4, color: '#d1fae5' },
  { day: 'Fri', date: '13', sessions: 2, color: '#dbeafe' },
  { day: 'Sat', date: '14', sessions: 0, color: '#f2f4f7' },
];

const CounsellorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex' }}>
      <CounsellorSidebar />
      <div style={{ marginLeft: '240px', flex: 1 }}>
        <div className="cd-page">

          {/* Topbar */}
          <div className="cd-topbar">
            <div>
              <h1 className="cd-heading">Good morning, Dr. Amina 👋</h1>
              <p className="cd-date">Monday, 9 June 2026</p>
            </div>
            <button className="cd-sessions-btn" onClick={() => navigate('/counsellor/sessions')}>
              📋 View all sessions
            </button>
          </div>

          <div className="cd-grid">

            {/* Banner */}
            <div className="cd-banner">
              <div>
                <h2 className="cd-banner-title">You have 3 sessions today</h2>
                <p className="cd-banner-sub">Next session: James Mwangi at 9:00 AM · Video call · Anxiety</p>
                <div className="cd-banner-actions">
                  <button className="cd-btn-white" onClick={() => navigate('/counsellor/sessions')}>
                    📋 View sessions
                  </button>
                  <button className="cd-btn-outline" onClick={() => navigate('/counsellor/slots')}>
                    🕐 Manage slots
                  </button>
                </div>
              </div>
              <div style={{ fontSize: '52px' }}>🩺</div>
            </div>

            {/* Stats */}
            <div className="cd-stats-row">
              {stats.map((s, i) => (
                <div key={i} className="cd-stat-card">
                  <div className="cd-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                  <div>
                    <div className="cd-stat-value">{s.value}</div>
                    <div className="cd-stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly calendar */}
            <div className="cd-card">
              <div className="cd-card-header">
                <div className="cd-card-title">📅 This week at a glance</div>
                <button className="cd-card-link" onClick={() => navigate('/counsellor/slots')}>
                  Manage slots →
                </button>
              </div>
              <div className="cd-week-row">
                {weekDays.map((d, i) => (
                  <div key={i} className={`cd-day-col ${d.today ? 'today' : ''}`}>
                    <div className="cd-day-name">{d.day}</div>
                    <div className="cd-day-num" style={d.today ? { background: '#065f46', color: '#fff' } : {}}>
                      {d.date}
                    </div>
                    <div className="cd-day-dot" style={{ background: d.sessions > 0 ? d.color : '#f2f4f7', border: d.sessions > 0 ? `1.5px solid ${d.color}` : '1.5px solid #e4e7ec' }} />
                    <div className="cd-day-count">{d.sessions > 0 ? `${d.sessions} sessions` : 'Free'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming sessions + pending */}
            <div className="cd-bottom-row">

              {/* Upcoming */}
              <div className="cd-card">
                <div className="cd-card-header">
                  <div className="cd-card-title">🕐 Upcoming sessions</div>
                  <button className="cd-card-link" onClick={() => navigate('/counsellor/sessions')}>
                    View all →
                  </button>
                </div>
                <div className="cd-session-list">
                  {upcomingSessions.map((s) => (
                    <div key={s.id} className="cd-session-item">
                      <div className="cd-s-avatar">{s.avatar}</div>
                      <div className="cd-s-info">
                        <div className="cd-s-name">{s.name}</div>
                        <div className="cd-s-detail">{s.type} · {s.topic}</div>
                        <div className="cd-s-time">{s.day} at {s.time}</div>
                      </div>
                      <div className="cd-s-right">
                        <span className={`cd-badge ${s.status}`}>
                          {s.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
                        </span>
                        {s.status === 'confirmed' && (
                          <button className="cd-start-btn">Start</button>
                        )}
                        {s.status === 'pending' && (
                          <div className="cd-action-row">
                            <button className="cd-approve-btn" onClick={() => navigate('/counsellor/sessions')}>Approve</button>
                            <button className="cd-reject-btn" onClick={() => navigate('/counsellor/sessions')}>Reject</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="cd-card">
                <div className="cd-card-header">
                  <div className="cd-card-title">⚡ Quick actions</div>
                </div>
                <div className="cd-quick-list">
                  <button className="cd-quick-btn" onClick={() => navigate('/counsellor/sessions')}>
                    <span>📋</span>
                    <div>
                      <div className="cd-quick-title">Review pending bookings</div>
                      <div className="cd-quick-sub">4 bookings awaiting your approval</div>
                    </div>
                  </button>
                  <button className="cd-quick-btn" onClick={() => navigate('/counsellor/slots')}>
                    <span>🕐</span>
                    <div>
                      <div className="cd-quick-title">Update availability</div>
                      <div className="cd-quick-sub">Add or remove time slots</div>
                    </div>
                  </button>
                  <button className="cd-quick-btn" onClick={() => navigate('/counsellor/notes')}>
                    <span>📝</span>
                    <div>
                      <div className="cd-quick-title">Write session notes</div>
                      <div className="cd-quick-sub">Add notes for completed sessions</div>
                    </div>
                  </button>
                  <button className="cd-quick-btn" onClick={() => navigate('/counsellor/profile')}>
                    <span>👤</span>
                    <div>
                      <div className="cd-quick-title">Edit profile</div>
                      <div className="cd-quick-sub">Update your specialisation and bio</div>
                    </div>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorDashboard;

