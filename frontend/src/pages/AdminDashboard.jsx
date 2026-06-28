import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { getDashboardStats } from '../api';
import '../styles/AdminDashboard.css';
import '../styles/AdminSidebar.css';
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStatsData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <AdminSidebar />
        <div style={{ marginLeft: '240px', flex: 1, padding: '40px', textAlign: 'center', color: '#667085' }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  const stats = [
    { icon: '🎓', label: 'Total students',    value: statsData?.totalStudents ?? 0,    bg: '#dbeafe' },
    { icon: '🩺', label: 'Total counsellors', value: statsData?.totalCounsellors ?? 0, bg: '#d1fae5' },
    { icon: '📅', label: 'Total sessions',    value: statsData?.totalBookings ?? 0,    bg: '#fef3c7' },
    { icon: '🧠', label: 'Mood check-ins',    value: statsData?.totalMoodCheckIns ?? 0,bg: '#f3e8ff' },
  ];

  // Build a combined, sorted recent activity feed
  const recentActivity = [
    ...(statsData?.recentStudents || []).map((s) => ({
      id: `student-${s._id}`,
      icon: '👤',
      message: `New student registered: ${s.fullName}`,
      time: new Date(s.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }),
      type: 'student',
      date: s.createdAt,
    })),
    ...(statsData?.recentCounsellors || []).map((c) => ({
      id: `counsellor-${c._id}`,
      icon: '🩺',
      message: `New counsellor ${c.status === 'pending' ? 'awaiting approval' : 'approved'}: ${c.fullName}`,
      time: new Date(c.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }),
      type: 'counsellor',
      date: c.createdAt,
    })),
    ...(statsData?.recentBookings || []).map((b) => ({
      id: `booking-${b._id}`,
      icon: '📅',
      message: `${b.student?.fullName || 'A student'} booked a session with ${b.counsellor?.fullName || 'a counsellor'}`,
      time: new Date(b.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }),
      type: 'session',
      date: b.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  const topCounsellors = statsData?.topCounsellors || [];

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