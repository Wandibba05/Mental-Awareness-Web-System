import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getActiveCounsellors, createBooking, getOpenSlotsForCounsellor } from '../api';
import '../styles/SessionBooking.css';
import '../styles/Sidebar.css';



const sessionTypes = [
  { id: 'video',     label: 'Video call', icon: '📹' },
  { id: 'call',      label: 'Phone call', icon: '📞' },
  { id: 'in-person', label: 'In-person',  icon: '🏥' },
];

const STEPS = ['Select counsellor', 'Choose slot', 'Confirm booking'];

const SessionBooking = () => {
  const navigate = useNavigate();
  const [step, setStep]                     = useState(1);
  const [counsellors, setCounsellors]       = useState([]);
  const [loadingCounsellors, setLoadingCounsellors] = useState(true);
  const [selectedCounsellor, setCounsellor] = useState(null);
  const [sessionType, setSessionType]       = useState('video');
  const [reason, setReason]                 = useState('');
  const [slots, setSlots]                   = useState([]);
  const [loadingSlots, setLoadingSlots]     = useState(false);
  const [selectedDay, setSelectedDay]       = useState(null);
  const [selectedTime, setSelectedTime]     = useState(null);
  const [confirmed, setConfirmed]           = useState(false);
  const [submitting, setSubmitting]         = useState(false);

  // Fetch active counsellors when the page loads
  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        const data = await getActiveCounsellors();
        setCounsellors(data);
      } catch (error) {
        console.error('Failed to fetch counsellors:', error);
      } finally {
        setLoadingCounsellors(false);
      }
    };
    fetchCounsellors();
  }, []);

  // Fetch open slots whenever a counsellor is selected
  useEffect(() => {
    if (!selectedCounsellor) {
      setSlots([]);
      return;
    }
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const data = await getOpenSlotsForCounsellor(selectedCounsellor._id);
        setSlots(data);
        // Auto-select the first day that has slots
        const firstDay = data.length > 0 ? data[0].day : null;
        setSelectedDay(firstDay);
        setSelectedTime(null);
      } catch (error) {
        console.error('Failed to fetch slots:', error);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedCounsellor]);

  // Group slots by day for display
  const slotsByDay = slots.reduce((acc, s) => {
    if (!acc[s.day]) acc[s.day] = [];
    acc[s.day].push(s);
    return acc;
  }, {});

  const availableDays = Object.keys(slotsByDay);
  const daySlots = selectedDay ? (slotsByDay[selectedDay] || []) : [];

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await createBooking({
        counsellor: selectedCounsellor._id,
        sessionType,
        reason,
        day: selectedDay,
        time: selectedTime,
      });

      setConfirmed(true);
      setTimeout(() => navigate('/student/dashboard'), 2500);
    } catch (error) {
      alert('Something went wrong while creating your booking. Please try again.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
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
                  {loadingCounsellors ? (
                    <div style={{ padding: '20px', color: '#667085' }}>Loading counsellors...</div>
                  ) : counsellors.length === 0 ? (
                    <div style={{ padding: '20px', color: '#667085' }}>No counsellors are available right now. Please check back later.</div>
                  ) : (
                    counsellors.map((c) => (
                      <div
                        key={c._id}
                        className={`counsellor-card ${selectedCounsellor?._id === c._id ? 'selected' : ''}`}
                        onClick={() => setCounsellor(c)}
                      >
                        <div className="c-avatar">
                          {c.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                        </div>
                        <div className="c-info">
                          <div className="c-name">{c.fullName}</div>
                          <div className="c-spec">{c.specialisation || 'General counselling'}</div>
                          <span className="c-badge available">Available</span>
                        </div>
                        {selectedCounsellor?._id === c._id && <div className="selected-tick">Selected</div>}
                      </div>
                    ))
                  )}
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

    {loadingSlots ? (
      <p style={{ color: '#667085', fontSize: '13px' }}>Loading available slots...</p>
    ) : availableDays.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '20px', color: '#98a2b3' }}>
        <div style={{ fontSize: '36px' }}>📭</div>
        <p>{selectedCounsellor?.fullName} has no available slots right now. Please choose a different counsellor or check back later.</p>
      </div>
    ) : (
      <>
        <div className="sb-section">
          <div className="sb-section-label">Select a day</div>
          <div className="day-row">
            {availableDays.map((day) => (
              <button
                key={day}
                className={`day-btn ${selectedDay === day ? 'active' : ''}`}
                onClick={() => { setSelectedDay(day); setSelectedTime(null); }}
              >
                <div className="day-name">{day}</div>
                <div className="day-slots">{slotsByDay[day].length} slots</div>
              </button>
            ))}
          </div>
        </div>

        <div className="sb-section">
          <div className="sb-section-label">Available times — {selectedDay}</div>
          <div className="time-grid">
            {daySlots.map((slot) => (
              <button
                key={slot._id}
                className={`time-btn ${selectedTime === slot.time ? 'active' : ''}`}
                onClick={() => setSelectedTime(slot.time)}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>

        {selectedTime && (
          <div className="selected-slot-banner">
            <strong>Selected:</strong> {selectedDay} at {selectedTime} with {selectedCounsellor?.fullName}
          </div>
        )}
      </>
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
                    <p>Your session request has been sent to {selectedCounsellor?.fullName}. You will be notified once confirmed.</p>
                    <p className="redirect-note">Redirecting to dashboard...</p>
                  </div>
                ) : (
                  <>
                    <div className="sb-card-title">Review your booking</div>
                    <div className="confirm-card">
                      <div className="confirm-header">Booking summary</div>
                      <div className="confirm-row">
                        <span className="confirm-key">Counsellor</span>
                        <span className="confirm-val">{selectedCounsellor?.fullName}</span>
                      </div>
                      <div className="confirm-row">
                        <span className="confirm-key">Specialisation</span>
                        <span className="confirm-val">{selectedCounsellor?.specialisation || 'General counselling'}</span>
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
                      <button className="sb-btn-confirm" onClick={handleConfirm} disabled={submitting}>
                        {submitting ? 'Booking...' : 'Confirm session'}
                      </button>
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
