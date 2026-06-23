import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CounsellorSidebar from '../components/CounsellorSidebar';
import { getCounsellorBookings, updateBookingStatus } from '../api';
import '../styles/CounsellorSessions.css';
import '../styles/CounsellorSidebar.css';

const filters = ['All', 'Pending', 'Confirmed', 'Completed', 'Rescheduled'];

const CounsellorSessions = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId]     = useState(null);
  const [sessions, setSessions]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [noteText, setNoteText]         = useState('');
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [savingNote, setSavingNote]     = useState(false);

  // Fetch this counsellor's bookings on page load
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getCounsellorBookings();
        setSessions(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered = sessions.filter((s) =>
    activeFilter === 'All' ? true : s.status.toLowerCase() === activeFilter.toLowerCase()
  );

  const updateStatus = async (id, newStatus) => {
    try {
      const updated = await updateBookingStatus(id, newStatus);
      setSessions((prev) => prev.map((s) => (s._id === id ? updated : s)));
    } catch (error) {
      alert('Failed to update booking status. Please try again.');
      console.error(error);
    }
  };

  const openNotesPanel = (session) => {
    setActiveNoteId(activeNoteId === session._id ? null : session._id);
    setNoteText(session.notes || '');
  };

  const saveNotes = async (id) => {
    setSavingNote(true);
    try {
      const updated = await updateBookingStatus(id, sessions.find((s) => s._id === id).status, noteText);
      setSessions((prev) => prev.map((s) => (s._id === id ? updated : s)));
      setActiveNoteId(null);
      setNoteText('');
    } catch (error) {
      alert('Failed to save notes. Please try again.');
      console.error(error);
    } finally {
      setSavingNote(false);
    }
  };

  const badgeStyle = (status) => {
    switch (status) {
      case 'confirmed':   return { bg: '#dcfce7', text: '#166534', label: 'Confirmed'   };
      case 'pending':     return { bg: '#fef3c7', text: '#92400e', label: 'Pending'     };
      case 'completed':   return { bg: '#e0e7ff', text: '#3730a3', label: 'Completed'   };
      case 'rescheduled': return { bg: '#ffedd5', text: '#9a3412', label: 'Rescheduled' };
      case 'cancelled':   return { bg: '#fee2e2', text: '#991b1b', label: 'Cancelled'   };
      default:            return { bg: '#f2f4f7', text: '#344054', label: status        };
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <CounsellorSidebar />
      <div style={{ marginLeft: '240px', flex: 1 }}>
        <div className="cs-page">

          {/* Topbar */}
          <div className="cs-topbar">
            <div>
              <h1 className="cs-title">Sessions</h1>
              <p className="cs-sub">
                {sessions.filter((s) => s.status === 'pending').length} pending approval ·{' '}
                {sessions.filter((s) => s.status === 'confirmed').length} confirmed
              </p>
            </div>
            <button className="cs-back-btn" onClick={() => navigate('/counsellor/dashboard')}>
              Back to dashboard
            </button>
          </div>

          {/* Filter tabs */}
          <div className="cs-filters">
            {filters.map((f) => (
              <button
                key={f}
                className={`cs-filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
                <span className="cs-filter-count">
                  {f === 'All' ? sessions.length : sessions.filter((s) => s.status.toLowerCase() === f.toLowerCase()).length}
                </span>
              </button>
            ))}
          </div>

          {/* Sessions list */}
          <div className="cs-content">
            {loading ? (
              <div className="cs-empty">
                <div style={{ fontSize: '40px' }}>⏳</div>
                <p>Loading sessions...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="cs-empty">
                <div style={{ fontSize: '40px' }}>📭</div>
                <p>No sessions found for this filter.</p>
              </div>
            ) : (
              filtered.map((s) => {
                const badge = badgeStyle(s.status);
                const isExpanded = expandedId === s._id;
                const isNotingFor = activeNoteId === s._id;
                const studentName = s.student?.fullName || 'Unknown student';
                const initials = studentName.split(' ').map((n) => n[0]).join('').substring(0, 2);
                return (
                  <div key={s._id} className={`cs-session-card ${s.status}`}>
                    <div className="cs-session-top">
                      {/* Avatar + info */}
                      <div className="cs-session-left">
                        <div className="cs-s-avatar">{initials}</div>
                        <div>
                          <div className="cs-s-name">{studentName}</div>
                          <div className="cs-s-detail">
                            {s.sessionType}
                            {s.reason ? ` · ${s.reason.substring(0, 40)}${s.reason.length > 40 ? '...' : ''}` : ''}
                          </div>
                          <div className="cs-s-time">{s.day} at {s.time}</div>
                        </div>
                      </div>

                      {/* Badge + actions */}
                      <div className="cs-session-right">
                        <span className="cs-status-badge" style={{ background: badge.bg, color: badge.text }}>
                          {badge.label}
                        </span>
                        <div className="cs-action-btns">
                          {s.status === 'pending' && (
                            <>
                              <button className="cs-btn-approve" onClick={() => updateStatus(s._id, 'confirmed')}>Approve</button>
                              <button className="cs-btn-reschedule" onClick={() => updateStatus(s._id, 'rescheduled')}>Reschedule</button>
                              <button className="cs-btn-reject" onClick={() => updateStatus(s._id, 'cancelled')}>Reject</button>
                            </>
                          )}
                          {s.status === 'confirmed' && (
                            <>
                              <button className="cs-btn-start">Start session</button>
                              <button className="cs-btn-notes" onClick={() => openNotesPanel(s)}>Notes</button>
                            </>
                          )}
                          {s.status === 'completed' && (
                            <>
                              <button className="cs-btn-notes" onClick={() => openNotesPanel(s)}>View notes</button>
                              <button className="cs-btn-reschedule">Follow-up</button>
                            </>
                          )}
                          <button className="cs-btn-expand" onClick={() => setExpandedId(isExpanded ? null : s._id)}>
                            {isExpanded ? 'Hide ▲' : 'Details ▼'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded reason */}
                    {isExpanded && (
                      <div className="cs-reason-box">
                        <div className="cs-reason-label">Student reason:</div>
                        <div className="cs-reason-text">{s.reason || 'No reason provided.'}</div>
                      </div>
                    )}

                    {/* Notes panel */}
                    {isNotingFor && (
                      <div className="cs-notes-panel">
                        <div className="cs-notes-label">
                          Session notes — {studentName} <span className="cs-notes-private">🔒 Confidential</span>
                        </div>
                        <textarea
                          className="cs-notes-textarea"
                          placeholder="Write your session notes here. These are private and confidential..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          maxLength={500}
                        />
                        <div className="cs-notes-footer">
                          <span style={{ fontSize: '11px', color: '#98a2b3' }}>{noteText.length} / 500</span>
                          <button className="cs-btn-save-notes" onClick={() => saveNotes(s._id)} disabled={savingNote}>
                            {savingNote ? 'Saving...' : 'Save notes'}
                          </button>
                        </div>
                      </div>
                    )}
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

export default CounsellorSessions;