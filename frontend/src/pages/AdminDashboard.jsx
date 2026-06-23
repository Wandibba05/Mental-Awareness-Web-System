import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminDashboard.css';
import '../styles/AdminSidebar.css';

const stats = [
  { icon: '🎓', label: 'Total students',    value: '342', bg: '#dbeafe', change: '+12 this month' },
  { icon: '🩺', label: 'Total counsellors', value: '18',  bg: '#d1fae5', change: '+2 this month'  },
  { icon: '📅', label: 'Total sessions',    value: '1,204', bg: '#fef3c7', change: '+86 this week' },
  { icon: '🧠', label: 'Mood check-ins',    value: '3,890', bg: '#f3e8ff', change: '+210 this week' },
];

const recentActivity = [
  { id: 1, icon: '👤', message: 'New student registered: Faith Wambui',           time: '10 min ago', type: 'student'    },
  { id: 2, icon: '🩺', message: 'New counsellor approved: Dr. Peter Mwangi',       time: '1 hour ago', type: 'counsellor' },
  { id: 3, icon: '📅', message: '12 new sessions booked today',                    time: '2 hours ago',type: 'session'    },
  { id: 4, icon: '⚠️', message: '3 students flagged for low mood scores this week',time: '3 hours ago',type: 'alert'      },
  { id: 5, icon: '🚫', message: 'Student account disabled: violation of terms',    time: '5 hours ago',type: 'disabled'   },
];

const topCounsellors = [
  { name: 'Dr. Amina Kariuki', sessions: 84, rating: 4.8, avatar: 'AK' },
  { name: 'Dr. Fatuma Hassan', sessions: 97, rating: 4.9, avatar: 'FH' },
  { name: 'Dr. James Omondi',  sessions: 62, rating: 4.6, avatar: 'JO' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div style={{ marginLeft: '240px', flex: 1 }}>
        <div className="ad-page">

          {/* Topbar */}
          <div className="ad-topbar">
            <div>
              <h1 className="ad-heading">System overview</h1>
              <p className="ad-date">Monday, 9 June 2026</p>
            </div>
            <button className="ad-reports-btn" onClick={() => navigate('/admin/reports')}>
              📊 View full reports
            </button>
          </div>

          <div className="ad-grid">

            {/* Banner */}
            <div className="ad-banner">
              <div>
                <h2 className="ad-banner-title">Welcome back, Administrator 🛡️</h2>
                <p className="ad-banner-sub">Here is what is happening across the platform today</p>
                <div className="ad-banner-actions">
                  <button className="ad-btn-white" onClick={() => navigate('/admin/users')}>
                    👥 Manage users
                  </button>
                  <button className="ad-btn-outline" onClick={() => navigate('/admin/reports')}>
                    📊 View reports
                  </button>
                </div>
              </div>
              <div style={{ fontSize: '52px' }}>🛡️</div>
            </div>

            {/* Stats */}
            <div className="ad-stats-row">
              {stats.map((s, i) => (
                <div key={i} className="ad-stat-card">
                  <div className="ad-stat-top">
                    <div className="ad-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                    <span className="ad-stat-change">{s.change}</span>
                  </div>
                  <div className="ad-stat-value">{s.value}</div>
                  <div className="ad-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="ad-bottom-row">

              {/* Recent activity */}
              <div className="ad-card">
                <div className="ad-card-header">
                  <div className="ad-card-title">🔔 Recent activity</div>
                </div>
                <div className="ad-activity-list">
                  {recentActivity.map((a) => (
                    <div key={a.id} className={`ad-activity-item ${a.type}`}>
                      <span className="ad-activity-icon">{a.icon}</span>
                      <div>
                        <div className="ad-activity-message">{a.message}</div>
                        <div className="ad-activity-time">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top counsellors */}
              <div className="ad-card">
                <div className="ad-card-header">
                  <div className="ad-card-title">⭐ Top counsellors</div>
                  <button className="ad-card-link" onClick={() => navigate('/admin/users')}>
                    View all →
                  </button>
                </div>
                <div className="ad-counsellor-list">
                  {topCounsellors.map((c, i) => (
                    <div key={i} className="ad-counsellor-item">
                      <div className="ad-c-avatar">{c.avatar}</div>
                      <div className="ad-c-info">
                        <div className="ad-c-name">{c.name}</div>
                        <div className="ad-c-meta">{c.sessions} sessions · ⭐ {c.rating}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="ad-quick-actions">
                  <button className="ad-quick-btn" onClick={() => navigate('/admin/users')}>
                    ➕ Add new counsellor
                  </button>
                  <button className="ad-quick-btn" onClick={() => navigate('/admin/users')}>
                    👥 View all users
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

export default AdminDashboard;