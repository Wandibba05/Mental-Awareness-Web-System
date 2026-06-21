import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CounsellorSidebar from '../components/CounsellorSidebar';
import '../styles/CounsellorSessions.css';
import '../styles/CounsellorSidebar.css';

const allSessions = [
  { id: 1, name: 'James Mwangi',  avatar: 'JM', topic: 'Anxiety',    type: 'Video',     day: 'Today',     time: '9:00 AM',  status: 'confirmed', reason: 'Feeling anxious about upcoming exams and struggling to manage workload.' },
  { id: 2, name: 'Sara Mutua',    avatar: 'SM', topic: 'Depression', type: 'In-person', day: 'Today',     time: '11:00 AM', status: 'pending',   reason: 'Low mood for the past two weeks, finding it hard to get out of bed.' },
  { id: 3, name: 'Aisha Omar',    avatar: 'AO', topic: 'Stress',     type: 'Video',     day: 'Tomorrow',  time: '2:00 PM',  status: 'confirmed', reason: 'Work and study balance is overwhelming. Need coping strategies.' },
  { id: 4, name: 'Tom Kipchoge',  avatar: 'TK', topic: 'Anxiety',    type: 'Call',      day: 'Mon 9 Jun', time: '10:00 AM', status: 'completed', reason: 'Follow up on breathing techniques discussed last session.' },
  { id: 5, name: 'Lily Wanjiru',  avatar: 'LW', topic: 'Grief',      type: 'In-person', day: 'Wed 11 Jun',time: '1:00 PM',  status: 'pending',   reason: 'Lost a family member recently and struggling to cope.' },
  { id: 6, name: 'Kevin Odhiambo',avatar: 'KO', topic: 'Recovery',   type: 'Video',     day: 'Thu 12 Jun',time: '3:00 PM',  status: 'rescheduled',reason: 'Originally booked for Monday. Requested reschedule due to class.' },
];

const filters = ['All', 'Pending', 'Confirmed', 'Completed', 'Rescheduled'];

const CounsellorSessions = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId]     = useState(null);
  const [sessions, setSessions]         = useState(allSessions);
  const [noteText, setNoteText]         = useState('');
  const [activeNoteId, setActiveNoteId] = useState(null);

  const filtered = sessions.filter((s) =>
    activeFilter === 'All' ? true : s.status.toLowerCase() === activeFilter.toLowerCase()
  );

  const updateStatus = (id, newStatus) => {
    setSessions((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus } : s));
  };

  const badgeStyle = (status) => {
    switch (status) {
      case 'confirmed':   return { bg: '#dcfce7', text: '#166534', label: 'Confirmed'   };
      case 'pending':     return { bg: '#fef3c7', text: '#92400e', label: 'Pending'     };
      case 'completed':   return { bg: '#e0e7ff', text: '#3730a3', label: 'Completed'   };
      case 'rescheduled': return { bg: '#ffedd5', text: '#9a3412', label: 'Rescheduled' };
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
              <p className="cs-sub">{sessions.filter(s => s.status === 'pending').length} pending approval · {sessions.filter(s => s.status === 'confirmed').length} confirmed</p>
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
                  {f === 'All' ? sessions.length : sessions.filter(s => s.status.toLowerCase() === f.toLowerCase()).length}
                </span>
              </button>
            ))}
          </div>

          {/* Sessions list */}
          <div className="cs-content">
            {filtered.length === 0 ? (
              <div className="cs-empty">
                <div style={{ fontSize: '40px' }}>📭</div>
                <p>No sessions found for this filter.</p>
              </div>
            ) : (
              filtered.map((s) => {
                const badge = badgeStyle(s.status);
                const isExpanded = expandedId === s.id;
                const isNotingFor = activeNoteId === s.id;
                return (
                  <div key={s.id} className={`cs-session-card ${s.status}`}>
                    <div className="cs-session-top">
                      {/* Avatar + info */}
                      <div className="cs-session-left">
                        <div className="cs-s-avatar">{s.avatar}</div>
                        <div>
                          <div className="cs-s-name">{s.name}</div>
                          <div className="cs-s-detail">{s.type} · {s.topic}</div>
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
                              <button className="cs-btn-approve" onClick={() => updateStatus(s.id, 'confirmed')}>Approve</button>
                              <button className="cs-btn-reschedule" onClick={() => updateStatus(s.id, 'rescheduled')}>Reschedule</button>
                              <button className="cs-btn-reject" onClick={() => updateStatus(s.id, 'completed')}>Reject</button>
                            </>
                          )}
                          {s.status === 'confirmed' && (
                            <>
                              <button className="cs-btn-start">Start session</button>
                              <button className="cs-btn-notes" onClick={() => setActiveNoteId(isNotingFor ? null : s.id)}>Notes</button>
                            </>
                          )}
                          {s.status === 'completed' && (
                            <>
                              <button className="cs-btn-notes" onClick={() => setActiveNoteId(isNotingFor ? null : s.id)}>View notes</button>
                              <button className="cs-btn-reschedule">Follow-up</button>
                            </>
                          )}
                          <button className="cs-btn-expand" onClick={() => setExpandedId(isExpanded ? null : s.id)}>
                            {isExpanded ? 'Hide ▲' : 'Details ▼'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded reason */}
                    {isExpanded && (
                      <div className="cs-reason-box">
                        <div className="cs-reason-label">Student reason:</div>
                        <div className="cs-reason-text">{s.reason}</div>
                      </div>
                    )}

                    {/* Notes panel */}
                    {isNotingFor && (
                      <div className="cs-notes-panel">
                        <div className="cs-notes-label">Session notes — {s.name} <span className="cs-notes-private">🔒 Confidential</span></div>
                        <textarea
                          className="cs-notes-textarea"
                          placeholder="Write your session notes here. These are private and confidential..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          maxLength={500}
                        />
                        <div className="cs-notes-footer">
                          <span style={{ fontSize: '11px', color: '#98a2b3' }}>{noteText.length} / 500</span>
                          <button className="cs-btn-save-notes" onClick={() => { setActiveNoteId(null); setNoteText(''); }}>
                            Save notes
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