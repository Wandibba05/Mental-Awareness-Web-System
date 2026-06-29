import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { getAllJournalsAdmin, updateJournalStatus } from '../api';
import '../styles/AdminJournals.css';
import '../styles/AdminSidebar.css';

const filters = ['All', 'Pending', 'Approved', 'Rejected'];

const AdminJournals = () => {
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Pending');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const data = await getAllJournalsAdmin();
        setJournals(data);
      } catch (error) {
        console.error('Failed to fetch journals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJournals();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const updated = await updateJournalStatus(id, newStatus);
      setJournals((prev) => prev.map((j) => (j._id === id ? updated : j)));
    } catch (error) {
      alert('Failed to update story status.');
      console.error(error);
    }
  };

  const filtered = journals.filter((j) =>
    activeFilter === 'All' ? true : j.status.toLowerCase() === activeFilter.toLowerCase()
  );

  const badgeStyle = (status) => {
    switch (status) {
      case 'approved': return { bg: '#dcfce7', text: '#166534', label: 'Approved' };
      case 'rejected': return { bg: '#fee2e2', text: '#991b1b', label: 'Rejected' };
      default:         return { bg: '#fef3c7', text: '#92400e', label: 'Pending'  };
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div style={{ marginLeft: '240px', flex: 1 }}>
        <div className="aj-page">

          {/* Topbar */}
          <div className="aj-topbar">
            <div>
              <h1 className="aj-title">Journal moderation</h1>
              <p className="aj-sub">
                {journals.filter((j) => j.status === 'pending').length} stories awaiting review
              </p>
            </div>
            <button className="aj-back-btn" onClick={() => navigate('/admin/dashboard')}>
              Back to dashboard
            </button>
          </div>

          {/* Filters */}
          <div className="aj-filters">
            {filters.map((f) => (
              <button
                key={f}
                className={`aj-filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
                <span className="aj-filter-count">
                  {f === 'All' ? journals.length : journals.filter((j) => j.status.toLowerCase() === f.toLowerCase()).length}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="aj-content">
            {loading ? (
              <div className="aj-empty">
                <div style={{ fontSize: '40px' }}>⏳</div>
                <p>Loading stories...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="aj-empty">
                <div style={{ fontSize: '40px' }}>📭</div>
                <p>No stories found for this filter.</p>
              </div>
            ) : (
              filtered.map((j) => {
                const badge = badgeStyle(j.status);
                const isExpanded = expandedId === j._id;
                return (
                  <div key={j._id} className="aj-card">
                    <div className="aj-card-top">
                      <div className="aj-card-left">
                        <span className="aj-card-tag">{j.category}</span>
                        <div className="aj-card-title">{j.title}</div>
                        <div className="aj-card-meta">
                          By {j.isAnonymous ? 'Anonymous' : (j.student?.fullName || 'Unknown')} ({j.student?.email || 'no email'}) ·{' '}
                          {new Date(j.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {j.rating ? ` · ⭐ ${j.rating}/5` : ''}
                        </div>
                      </div>
                      <span className="aj-status-badge" style={{ background: badge.bg, color: badge.text }}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="aj-card-excerpt">
                      {isExpanded ? j.storyText : `${j.storyText.substring(0, 150)}${j.storyText.length > 150 ? '...' : ''}`}
                    </div>

                    <div className="aj-card-actions">
                      <button className="aj-expand-btn" onClick={() => setExpandedId(isExpanded ? null : j._id)}>
                        {isExpanded ? 'Show less ▲' : 'Read full story ▼'}
                      </button>
                      <div className="aj-action-btns">
                        {j.status !== 'approved' && (
                          <button className="aj-btn-approve" onClick={() => updateStatus(j._id, 'approved')}>
                            ✅ Approve
                          </button>
                        )}
                        {j.status !== 'rejected' && (
                          <button className="aj-btn-reject" onClick={() => updateStatus(j._id, 'rejected')}>
                            ✕ Reject
                          </button>
                        )}
                        {j.status !== 'pending' && (
                          <button className="aj-btn-reset" onClick={() => updateStatus(j._id, 'pending')}>
                            Reset to pending
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminJournals;