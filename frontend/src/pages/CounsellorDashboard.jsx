import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CounsellorSidebar from '../components/CounsellorSidebar';
import { getCounsellorBookings } from '../api';
import '../styles/CounsellorDashboard.css';
import '../styles/CounsellorSidebar.css';

const CounsellorDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getCounsellorBookings();
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <CounsellorSidebar />
        <div style={{ marginLeft: '240px', flex: 1, padding: '40px', textAlign: 'center', color: '#667085' }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  const pendingCount   = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  const stats = [
    { icon: '📅', label: 'Total sessions',    value: bookings.length,  bg: '#dbeafe' },
    { icon: '⏳', label: 'Pending approvals', value: pendingCount,     bg: '#fef3c7' },
    { icon: '✅', label: 'Confirmed',         value: confirmedCount,   bg: '#d1fae5' },
    { icon: '🏁', label: 'Completed',         value: completedCount,   bg: '#f3e8ff' },
  ];

  // Show the 3 most recent bookings as "upcoming"
  const upcomingSessions = bookings
    .filter((b) => b.status === 'pending' || b.status === 'confirmed')
    .slice(0, 3)
    .map((b) => ({
      id: b._id,
      name: b.student?.fullName || 'Unknown student',
      topic: b.reason ? b.reason.substring(0, 30) : 'General session',
      type: b.sessionType,
      time: b.time,
      day: b.day,
      status: b.status,
      avatar: (b.student?.fullName || 'NA').split(' ').map((n) => n[0]).join('').substring(0, 2),
    }));

  const nextSession = upcomingSessions[0];

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
                <h2 className="cd-banner-title">
                  You have {pendingCount} pending and {confirmedCount} confirmed session{(pendingCount + confirmedCount) !== 1 ? 's' : ''}
                </h2>
                <p className="cd-banner-sub">
                  {nextSession
                    ? `Next session: ${nextSession.name} at ${nextSession.time} · ${nextSession.type} · ${nextSession.day}`
                    : 'No upcoming sessions right now.'}
                </p>
              </div>
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

            {/* Quick summary */}
            <div className="cd-card">
              <div className="cd-card-header">
                <div className="cd-card-title">📅 Manage your availability</div>
                <button className="cd-card-link" onClick={() => navigate('/counsellor/slots')}>
                  Manage slots →
                </button>
              </div>
              <p style={{ color: '#667085', fontSize: '13px' }}>
                You have {bookings.length} total booking{bookings.length !== 1 ? 's' : ''} across all statuses.
                Set your weekly availability so students can book sessions with you.
              </p>
            </div>

            {/* Upcoming sessions + Quick actions */}
            <div className="cd-bottom-row">

              {/* Upcoming */}
              <div className="cd-card">
                <div className="cd-card-header">
                  <div className="cd-card-title">🕐 Upcoming sessions</div>
                  <button className="cd-card-link" onClick={() => navigate('/counsellor/sessions')}>
                    View all →
                  </button>
                </div>
                {upcomingSessions.length === 0 ? (
                  <p style={{ color: '#98a2b3', fontSize: '13px', padding: '10px 0' }}>No upcoming sessions right now.</p>
                ) : (
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
                )}
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
                      <div className="cd-quick-sub">{pendingCount} booking{pendingCount !== 1 ? 's' : ''} awaiting your approval</div>
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