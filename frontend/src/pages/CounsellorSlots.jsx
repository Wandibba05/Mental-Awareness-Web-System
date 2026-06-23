import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CounsellorSidebar from '../components/CounsellorSidebar';
import '../styles/CounsellorSlots.css';
import '../styles/CounsellorSidebar.css';

const weekDays = [
  { day: 'Mon', date: '9'  },
  { day: 'Tue', date: '10', today: true },
  { day: 'Wed', date: '11' },
  { day: 'Thu', date: '12' },
  { day: 'Fri', date: '13' },
  { day: 'Sat', date: '14' },
  { day: 'Sun', date: '15' },
];

// Mock slot data per day — replace with real API data later
const initialSlots = {
  'Mon': [
    { time: '9:00 AM',  status: 'open'   },
    { time: '10:00 AM', status: 'booked' },
    { time: '2:00 PM',  status: 'open'   },
  ],
  'Tue': [
    { time: '9:00 AM',  status: 'open'   },
    { time: '10:00 AM', status: 'booked' },
    { time: '11:30 AM', status: 'open'   },
    { time: '2:00 PM',  status: 'booked' },
    { time: '3:00 PM',  status: 'blocked'},
    { time: '4:00 PM',  status: 'open'   },
  ],
  'Wed': [
    { time: '10:00 AM', status: 'open'   },
    { time: '2:00 PM',  status: 'open'   },
  ],
  'Thu': [
    { time: '9:00 AM',  status: 'open'   },
    { time: '11:30 AM', status: 'booked' },
    { time: '4:00 PM',  status: 'open'   },
  ],
  'Fri': [
    { time: '9:00 AM',  status: 'open'   },
    { time: '1:00 PM',  status: 'open'   },
    { time: '3:30 PM',  status: 'booked' },
  ],
  'Sat': [],
  'Sun': [],
};

const CounsellorSlots = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState('Tue');
  const [slots, setSlots] = useState(initialSlots);
  const [newTime, setNewTime] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const daySlots = slots[selectedDay] || [];

  const toggleBlock = (index) => {
    setSlots((prev) => {
      const updated = { ...prev };
      const list = [...updated[selectedDay]];
      const slot = list[index];
      if (slot.status === 'booked') return prev; // cannot toggle a booked slot
      list[index] = { ...slot, status: slot.status === 'open' ? 'blocked' : 'open' };
      updated[selectedDay] = list;
      return updated;
    });
  };

  const removeSlot = (index) => {
    setSlots((prev) => {
      const updated = { ...prev };
      const list = [...updated[selectedDay]];
      if (list[index].status === 'booked') {
        alert('This slot has a booking and cannot be removed.');
        return prev;
      }
      list.splice(index, 1);
      updated[selectedDay] = list;
      return updated;
    });
  };

  const addSlot = () => {
    if (!newTime) return;
    setSlots((prev) => {
      const updated = { ...prev };
      updated[selectedDay] = [...(updated[selectedDay] || []), { time: newTime, status: 'open' }];
      return updated;
    });
    setNewTime('');
    setShowAddForm(false);
  };

  const counts = {
    open:    daySlots.filter((s) => s.status === 'open').length,
    booked:  daySlots.filter((s) => s.status === 'booked').length,
    blocked: daySlots.filter((s) => s.status === 'blocked').length,
  };

  return (
    <div style={{ display: 'flex' }}>
      <CounsellorSidebar />
      <div style={{ marginLeft: '240px', flex: 1 }}>
        <div className="csl-page">

          {/* Topbar */}
          <div className="csl-topbar">
            <div>
              <h1 className="csl-title">My availability</h1>
              <p className="csl-sub">Set and manage your open time slots for students to book</p>
            </div>
            <button className="csl-back-btn" onClick={() => navigate('/counsellor/dashboard')}>
              Back to dashboard
            </button>
          </div>

          <div className="csl-content">

            {/* Week selector */}
            <div className="csl-card">
              <div className="csl-section-label">Select a day</div>
              <div className="csl-week-row">
                {weekDays.map((d) => (
                  <button
                    key={d.day}
                    className={`csl-day-btn ${selectedDay === d.day ? 'active' : ''}`}
                    onClick={() => setSelectedDay(d.day)}
                  >
                    <div className="csl-day-name">{d.day}</div>
                    <div className="csl-day-num">{d.date}</div>
                    <div className="csl-day-slot-count">{(slots[d.day] || []).length} slots</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Slot summary */}
            <div className="csl-summary-row">
              <div className="csl-summary-card open">
                <div className="csl-summary-value">{counts.open}</div>
                <div className="csl-summary-label">Open slots</div>
              </div>
              <div className="csl-summary-card booked">
                <div className="csl-summary-value">{counts.booked}</div>
                <div className="csl-summary-label">Booked slots</div>
              </div>
              <div className="csl-summary-card blocked">
                <div className="csl-summary-value">{counts.blocked}</div>
                <div className="csl-summary-label">Blocked slots</div>
              </div>
            </div>

            {/* Slots grid */}
            <div className="csl-card">
              <div className="csl-card-header">
                <div className="csl-section-label" style={{ marginBottom: 0 }}>
                  {selectedDay} — time slots
                </div>
                <button className="csl-add-btn" onClick={() => setShowAddForm(!showAddForm)}>
                  + Add new slot
                </button>
              </div>

              {/* Add slot form */}
              {showAddForm && (
                <div className="csl-add-form">
                  <input
                    className="csl-add-input"
                    placeholder="e.g. 10:30 AM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                  <button className="csl-add-confirm" onClick={addSlot}>Add</button>
                  <button className="csl-add-cancel" onClick={() => { setShowAddForm(false); setNewTime(''); }}>Cancel</button>
                </div>
              )}

              {/* Slot list */}
              {daySlots.length === 0 ? (
                <div className="csl-empty">
                  <div style={{ fontSize: '36px' }}>📭</div>
                  <p>No slots set for {selectedDay}. Add a slot to start accepting bookings.</p>
                </div>
              ) : (
                <div className="csl-slots-grid">
                  {daySlots.map((slot, index) => (
                    <div key={index} className={`csl-slot-chip ${slot.status}`}>
                      <span className="csl-slot-time">{slot.time}</span>
                      <span className="csl-slot-status">
                        {slot.status === 'open' && 'Open'}
                        {slot.status === 'booked' && 'Booked'}
                        {slot.status === 'blocked' && 'Blocked'}
                      </span>
                      <div className="csl-slot-actions">
                        {slot.status !== 'booked' && (
                          <button className="csl-slot-toggle" onClick={() => toggleBlock(index)} title={slot.status === 'open' ? 'Block this slot' : 'Unblock this slot'}>
                            {slot.status === 'open' ? '🔒' : '🔓'}
                          </button>
                        )}
                        {slot.status !== 'booked' && (
                          <button className="csl-slot-remove" onClick={() => removeSlot(index)} title="Remove slot">
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info note */}
            <div className="csl-info-note">
              ℹ️ Booked slots cannot be removed or blocked directly — please go to the Sessions page to reschedule or cancel a booking.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorSlots;
