import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/SessionBooking.css';
import '../styles/Sidebar.css';

const counsellors = [
  { id: 1, name: 'Dr. Amina Kariuki',  specialisation: 'Anxiety & Stress',      rating: 4.8, sessions: 84, avatar: 'AK', available: true  },
  { id: 2, name: 'Dr. James Omondi',   specialisation: 'Depression & Recovery',  rating: 4.6, sessions: 62, avatar: 'JO', available: true  },
  { id: 3, name: 'Dr. Fatuma Hassan',  specialisation: 'Trauma & Grief',         rating: 4.9, sessions: 97, avatar: 'FH', available: false },
  { id: 4, name: 'Dr. Peter Mwangi',   specialisation: 'CBT & Mindfulness',      rating: 4.7, sessions: 73, avatar: 'PM', available: true  },
];

const availableSlots = {
  'Mon': ['9:00 AM', '11:00 AM', '2:00 PM'],
  'Tue': ['9:00 AM', '10:30 AM', '1:00 PM', '3:00 PM'],
  'Wed': ['10:00 AM', '2:00 PM'],
  'Thu': ['9:00 AM', '11:30 AM', '4:00 PM'],
  'Fri': ['9:00 AM', '1:00 PM', '3:30 PM'],
};

const sessionTypes = [
  { id: 'video',     label: 'Video call', icon: '📹' },
  { id: 'call',      label: 'Phone call', icon: '📞' },
  { id: 'in-person', label: 'In-person',  icon: '🏥' },
];

const STEPS = ['Select counsellor', 'Choose slot', 'Confirm booking'];

const SessionBooking = () => {
  const navigate = useNavigate();
  const [step, setStep]                     = useState(1);
  const [selectedCounsellor, setCounsellor] = useState(null);
  const [sessionType, setSessionType]       = useState('video');
  const [reason, setReason]                 = useState('');
  const [selectedDay, setSelectedDay]       = useState('Tue');
  const [selectedTime, setSelectedTime]     = useState(null);
  const [confirmed, setConfirmed]           = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => navigate('/student/dashboard'), 2500);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1 }}>
        <div className="sb-page">

          {/* Top bar */}
          <div className="sb-topbar">
            <div>
              <h1 className="sb-title">Book a session</h1>
              <p className="sb-sub">Connect with a counsellor who can support you</p>
            </div>
            <button className="back-btn" onClick={() => navigate('/student/dashboard')}>
              Back to dashboard
            </button>
          </div>

          {/* Step indicator */}
          <div className="steps-bar">
            {STEPS.map((label, i) => (
              <div key={i} className={`step-item ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'done' : ''}`}>
                <div className="step-circle">{step > i + 1 ? 'checkmark' : i + 1}</div>
                <span className="step-label">{label}</span>
                {i < STEPS.length - 1 && <div className="step-line" />}
              </div>
            ))}
          </div>

          <div className="sb-content">

            {/* STEP 1 */}
            {step === 1 && (
              <div className="sb-card">
                <div className="sb-card-title">Choose your counsellor</div>
                <div className="counsellor-grid">
                  {counsellors.map((c) => (
                    <div
                      key={c.id}
                      className={`counsellor-card ${selectedCounsellor?.id === c.id ? 'selected' : ''} ${!c.available ? 'unavailable' : ''}`}
                      onClick={() => c.available && setCounsellor(c)}
                    >
                      <div className="c-avatar">{c.avatar}</div>
                      <div className="c-info">
                        <div className="c-name">{c.name}</div>
                        <div className="c-spec">{c.specialisation}</div>
                        <div className="c-meta">
                          <span>Star {c.rating}</span>
                          <span> · </span>
                          <span>{c.sessions} sessions</span>
                        </div>
                        <span className={`c-badge ${c.available ? 'available' : 'not-available'}`}>
                          {c.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      {selectedCounsellor?.id === c.id && <div className="selected-tick">Selected</div>}
                    </div>
                  ))}
                </div>

                <div className="sb-section">
                  <div className="sb-section-label">Session type</div>
                  <div className="type-row">
                    {sessionTypes.map((t) => (
                      <button
                        key={t.id}
                        className={`type-btn ${sessionType === t.id ? 'active' : ''}`}
                        onClick={() => setSessionType(t.id)}
                      >
                        <span>{t.icon}</span> {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sb-section">
                  <div className="sb-section-label">Reason for session <span className="optional">(optional)</span></div>
                  <textarea
                    className="reason-textarea"
                    placeholder="Briefly describe what you would like to discuss..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    maxLength={300}
                  />
                  <div style={{ textAlign: 'right', fontSize: '11px', color: '#98a2b3', marginTop: '4px' }}>
                    {reason.length} / 300
                  </div>
                </div>

                <button className="sb-btn-primary" disabled={!selectedCounsellor} onClick={() => setStep(2)}>
                  View available slots
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="sb-card">
                <div className="sb-card-title">Choose a date and time</div>

                <div className="sb-section">
                  <div className="sb-section-label">Select a day</div>
                  <div className="day-row">
                    {Object.keys(availableSlots).map((day) => (
                      <button
                        key={day}
                        className={`day-btn ${selectedDay === day ? 'active' : ''}`}
                        onClick={() => { setSelectedDay(day); setSelectedTime(null); }}
                      >
                        <div className="day-name">{day}</div>
                        <div className="day-slots">{availableSlots[day].length} slots</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sb-section">
                  <div className="sb-section-label">Available times — {selectedDay}</div>
                  <div className="time-grid">
                    {availableSlots[selectedDay].map((time) => (
                      <button
                        key={time}
                        className={`time-btn ${selectedTime === time ? 'active' : ''}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedTime && (
                  <div className="selected-slot-banner">
                    <strong>Selected:</strong> {selectedDay} at {selectedTime} with {selectedCounsellor?.name}
                  </div>
                )}

                <div className="sb-btn-row">
                  <button className="sb-btn-secondary" onClick={() => setStep(1)}>Back</button>
                  <button className="sb-btn-primary" disabled={!selectedTime} onClick={() => setStep(3)}>
                    Review booking
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="sb-card">
                {confirmed ? (
                  <div className="confirm-success">
                    <div className="success-icon">🎉</div>
                    <h2>Booking submitted!</h2>
                    <p>Your session request has been sent to {selectedCounsellor?.name}. You will be notified once confirmed.</p>
                    <p className="redirect-note">Redirecting to dashboard...</p>
                  </div>
                ) : (
                  <>
                    <div className="sb-card-title">Review your booking</div>
                    <div className="confirm-card">
                      <div className="confirm-header">Booking summary</div>
                      <div className="confirm-row">
                        <span className="confirm-key">Counsellor</span>
                        <span className="confirm-val">{selectedCounsellor?.name}</span>
                      </div>
                      <div className="confirm-row">
                        <span className="confirm-key">Specialisation</span>
                        <span className="confirm-val">{selectedCounsellor?.specialisation}</span>
                      </div>
                      <div className="confirm-row">
                        <span className="confirm-key">Day</span>
                        <span className="confirm-val">{selectedDay}</span>
                      </div>
                      <div className="confirm-row">
                        <span className="confirm-key">Time</span>
                        <span className="confirm-val">{selectedTime} · 50 min</span>
                      </div>
                      <div className="confirm-row">
                        <span className="confirm-key">Session type</span>
                        <span className="confirm-val">
                          {sessionTypes.find((t) => t.id === sessionType)?.icon}{' '}
                          {sessionTypes.find((t) => t.id === sessionType)?.label}
                        </span>
                      </div>
                      {reason && (
                        <div className="confirm-row">
                          <span className="confirm-key">Reason</span>
                          <span className="confirm-val">{reason}</span>
                        </div>
                      )}
                    </div>
                    <div className="confirm-note">
                      The counsellor will review and approve your booking. You will receive a notification once confirmed.
                    </div>
                    <div className="sb-btn-row">
                      <button className="sb-btn-secondary" onClick={() => setStep(2)}>Edit booking</button>
                      <button className="sb-btn-confirm" onClick={handleConfirm}>Confirm session</button>
                    </div>
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionBooking;