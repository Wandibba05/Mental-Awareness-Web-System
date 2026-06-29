import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { getReportsData } from '../api';
import '../styles/AdminReports.css';
import '../styles/AdminSidebar.css';

const moodColors = {
  Terrible: '#ef4444',
  Low:      '#f97316',
  Okay:     '#eab308',
  Good:     '#22c55e',
  Great:    '#3b82f6',
};

const statusColors = {
  pending:     { color: '#92400e', bg: '#fef3c7', label: 'Pending'     },
  confirmed:   { color: '#166534', bg: '#dcfce7', label: 'Confirmed'   },
  completed:   { color: '#3730a3', bg: '#e0e7ff', label: 'Completed'   },
  rescheduled: { color: '#9a3412', bg: '#ffedd5', label: 'Rescheduled' },
  cancelled:   { color: '#991b1b', bg: '#fee2e2', label: 'Cancelled'   },
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const AdminReports = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('6months');
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReportsData();
        setReportsData(data);
      } catch (error) {
        console.error('Failed to fetch reports data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <AdminSidebar />
        <div style={{ marginLeft: '240px', flex: 1, padding: '40px', textAlign: 'center', color: '#667085' }}>
          Loading reports...
        </div>
      </div>
    );
  }

  // Transform sessionsPerMonth into chart-friendly format
  const sessionTrend = (reportsData?.sessionsPerMonth || []).map((s) => ({
    month: monthNames[s._id.month - 1],
    count: s.count,
  }));

  // Transform moodBreakdown into chart-friendly format with percentages
  const totalMoods = (reportsData?.moodBreakdown || []).reduce((sum, m) => sum + m.count, 0);
  const moodDistribution = (reportsData?.moodBreakdown || []).map((m) => ({
    label: m._id,
    value: totalMoods > 0 ? Math.round((m.count / totalMoods) * 100) : 0,
    color: moodColors[m._id] || '#98a2b3',
  }));

  // Transform statusBreakdown into chart-friendly format
  const sessionStatusBreakdown = (reportsData?.statusBreakdown || []).map((s) => ({
    label: statusColors[s._id]?.label || s._id,
    value: s.count,
    color: statusColors[s._id]?.color || '#344054',
    bg: statusColors[s._id]?.bg || '#f2f4f7',
  }));

  // Transform topConcerns into chart-friendly format
  const topConcerns = (reportsData?.topConcerns || []).map((c) => ({
    label: c._id === 'video' ? 'Video sessions' : c._id === 'call' ? 'Phone sessions' : 'In-person sessions',
    count: c.count,
  }));

  const maxSessions = sessionTrend.length > 0 ? Math.max(...sessionTrend.map((s) => s.count)) : 1;
  const totalStatusSessions = sessionStatusBreakdown.reduce((sum, s) => sum + s.value, 0) || 1;
  const maxConcern = topConcerns.length > 0 ? Math.max(...topConcerns.map((c) => c.count)) : 1;

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div style={{ marginLeft: '240px', flex: 1 }}>
        <div className="ar-page">

          {/* Topbar */}
          <div className="ar-topbar">
            <div>
              <h1 className="ar-title">Reports &amp; analytics</h1>
              <p className="ar-sub">System-wide insights and trends</p>
            </div>
            <div className="ar-topbar-right">
              <select className="ar-date-select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                <option value="30days">Last 30 days</option>
                <option value="6months">Last 6 months</option>
                <option value="1year">Last 1 year</option>
              </select>
              <button className="ar-back-btn" onClick={() => navigate('/admin/dashboard')}>
                Back to dashboard
              </button>
            </div>
          </div>

          <div className="ar-content">

            {/* Session trend chart */}
            <div className="ar-card">
              <div className="ar-card-header">
                <div className="ar-card-title">📈 Sessions booked per month</div>
              </div>
              {sessionTrend.length === 0 ? (
                <p style={{ color: '#98a2b3', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                  No session data available yet.
                </p>
              ) : (
                <div className="ar-bar-chart">
                  {sessionTrend.map((s, i) => (
                    <div key={i} className="ar-bar-col">
                      <div className="ar-bar-value">{s.count}</div>
                      <div className="ar-bar-wrap">
                        <div className="ar-bar" style={{ height: `${(s.count / maxSessions) * 100}%` }} />
                      </div>
                      <div className="ar-bar-label">{s.month}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="ar-row-2col">

              {/* Mood distribution */}
              <div className="ar-card">
                <div className="ar-card-header">
                  <div className="ar-card-title">🧠 Student mood distribution</div>
                </div>
                {moodDistribution.length === 0 ? (
                  <p style={{ color: '#98a2b3', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                    No mood check-ins recorded yet.
                  </p>
                ) : (
                  <div className="ar-mood-list">
                    {moodDistribution.map((m, i) => (
                      <div key={i} className="ar-mood-row">
                        <span className="ar-mood-label">{m.label}</span>
                        <div className="ar-mood-bar-wrap">
                          <div className="ar-mood-bar" style={{ width: `${m.value}%`, background: m.color }} />
                        </div>
                        <span className="ar-mood-pct">{m.value}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Session status breakdown */}
              <div className="ar-card">
                <div className="ar-card-header">
                  <div className="ar-card-title">📋 Session status breakdown</div>
                </div>
                {sessionStatusBreakdown.length === 0 ? (
                  <p style={{ color: '#98a2b3', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                    No bookings recorded yet.
                  </p>
                ) : (
                  <div className="ar-status-list">
                    {sessionStatusBreakdown.map((s, i) => (
                      <div key={i} className="ar-status-row">
                        <div className="ar-status-left">
                          <span className="ar-status-dot" style={{ background: s.color }} />
                          <span className="ar-status-label">{s.label}</span>
                        </div>
                        <div className="ar-status-right">
                          <span className="ar-status-value">{s.value}</span>
                          <span className="ar-status-pct">
                            {Math.round((s.value / totalStatusSessions) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Top concerns */}
            <div className="ar-card">
              <div className="ar-card-header">
                <div className="ar-card-title">🎯 Top reasons for sessions</div>
              </div>
              {topConcerns.length === 0 ? (
                <p style={{ color: '#98a2b3', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                  No session reasons recorded yet.
                </p>
              ) : (
                <div className="ar-concern-list">
                  {topConcerns.map((c, i) => (
                    <div key={i} className="ar-concern-row">
                      <span className="ar-concern-label">{c.label}</span>
                      <div className="ar-concern-bar-wrap">
                        <div className="ar-concern-bar" style={{ width: `${(c.count / maxConcern) * 100}%` }} />
                      </div>
                      <span className="ar-concern-count">{c.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Export */}
            <div className="ar-export-row">
              <button className="ar-export-btn">📄 Export as PDF</button>
              <button className="ar-export-btn">📊 Export as CSV</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
