import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminReports.css';
import '../styles/AdminSidebar.css';

// Mock data — replace with real API data later
const sessionTrend = [
  { month: 'Jan', count: 64  },
  { month: 'Feb', count: 78  },
  { month: 'Mar', count: 92  },
  { month: 'Apr', count: 105 },
  { month: 'May', count: 130 },
  { month: 'Jun', count: 148 },
];

const moodDistribution = [
  { label: 'Terrible', value: 8,  color: '#ef4444' },
  { label: 'Low',      value: 15, color: '#f97316' },
  { label: 'Okay',     value: 30, color: '#eab308' },
  { label: 'Good',     value: 32, color: '#22c55e' },
  { label: 'Great',    value: 15, color: '#3b82f6' },
];

const sessionStatusBreakdown = [
  { label: 'Completed',   value: 720, color: '#3730a3', bg: '#e0e7ff' },
  { label: 'Confirmed',   value: 310, color: '#166534', bg: '#dcfce7' },
  { label: 'Pending',     value: 95,  color: '#92400e', bg: '#fef3c7' },
  { label: 'Rescheduled', value: 48,  color: '#9a3412', bg: '#ffedd5' },
  { label: 'Cancelled',   value: 31,  color: '#991b1b', bg: '#fee2e2' },
];

const topConcerns = [
  { label: 'Anxiety',    count: 412 },
  { label: 'Stress',     count: 356 },
  { label: 'Depression', count: 289 },
  { label: 'Academic',   count: 201 },
  { label: 'Grief',      count: 94  },
];

const AdminReports = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('6months');

  const maxSessions = Math.max(...sessionTrend.map((s) => s.count));
  const totalStatusSessions = sessionStatusBreakdown.reduce((sum, s) => sum + s.value, 0);
  const maxConcern = Math.max(...topConcerns.map((c) => c.count));

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
            </div>

            <div className="ar-row-2col">

              {/* Mood distribution */}
              <div className="ar-card">
                <div className="ar-card-header">
                  <div className="ar-card-title">🧠 Student mood distribution</div>
                </div>
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
              </div>

              {/* Session status breakdown */}
              <div className="ar-card">
                <div className="ar-card-header">
                  <div className="ar-card-title">📋 Session status breakdown</div>
                </div>
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
              </div>

            </div>

            {/* Top concerns */}
            <div className="ar-card">
              <div className="ar-card-header">
                <div className="ar-card-title">🎯 Top reasons for sessions</div>
              </div>
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