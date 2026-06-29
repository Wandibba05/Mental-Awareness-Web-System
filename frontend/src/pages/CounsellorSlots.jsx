import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CounsellorSidebar from '../components/CounsellorSidebar';
import { getCounsellorSlots, createSlot, updateSlotStatus, deleteSlot } from '../api';
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

const CounsellorSlots = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState('Tue');
  const [allSlots, setAllSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTime, setNewTime] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await getCounsellorSlots();
        setAllSlots(data);
      } catch (error) {
        console.error('Failed to fetch slots:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, []);

  const daySlots = allSlots.filter((s) => s.day === selectedDay);

  const toggleBlock = async (slot) => {
    if (slot.status === 'booked') return;
    try {
      const newStatus = slot.status === 'open' ? 'blocked' : 'open';
      const updated = await updateSlotStatus(slot._id, newStatus);
      setAllSlots((prev) => prev.map((s) => (s._id === slot._id ? updated : s)));
    } catch (error) {
      alert('Failed to update slot.');
      console.error(error);
    }
  };

  const removeSlot = async (slot) => {
    if (slot.status === 'booked') {
      alert('This slot has a booking and cannot be removed.');
      return;
    }
    try {
      await deleteSlot(slot._id);
      setAllSlots((prev) => prev.filter((s) => s._id !== slot._id));
    } catch (error) {
      alert('Failed to remove slot.');
      console.error(error);
    }
  };

  const addSlot = async () => {
    if (!newTime) return;
    setAdding(true);
    try {
      const created = await createSlot(selectedDay, newTime);
      setAllSlots((prev) => [...prev, created]);
      setNewTime('');
      setShowAddForm(false);
    } catch (error) {
      alert('Failed to add slot.');
      console.error(error);
    } finally {
      setAdding(false);
    }
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
                    <div className="csl-day-slot-count">{allSlots.filter((s) => s.day === d.day).length} slots</div>
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
                  <button className="csl-add-confirm" onClick={addSlot} disabled={adding}>
                    {adding ? 'Adding...' : 'Add'}
                  </button>
                  <button className="csl-add-cancel" onClick={() => { setShowAddForm(false); setNewTime(''); }}>Cancel</button>
                </div>
              )}

              {/* Slot list */}
              {loading ? (
                <div className="csl-empty">
                  <div style={{ fontSize: '36px' }}>⏳</div>
                  <p>Loading slots...</p>
                </div>
              ) : daySlots.length === 0 ? (
                <div className="csl-empty">
                  <div style={{ fontSize: '36px' }}>📭</div>
                  <p>No slots set for {selectedDay}. Add a slot to start accepting bookings.</p>
                </div>
              ) : (
                <div className="csl-slots-grid">
                  {daySlots.map((slot) => (
                    <div key={slot._id} className={`csl-slot-chip ${slot.status}`}>
                      <span className="csl-slot-time">{slot.time}</span>
                      <span className="csl-slot-status">
                        {slot.status === 'open' && 'Open'}
                        {slot.status === 'booked' && 'Booked'}
                        {slot.status === 'blocked' && 'Blocked'}
                      </span>
                      <div className="csl-slot-actions">
                        {slot.status !== 'booked' && (
                          <button className="csl-slot-toggle" onClick={() => toggleBlock(slot)} title={slot.status === 'open' ? 'Block this slot' : 'Unblock this slot'}>
                            {slot.status === 'open' ? '🔒' : '🔓'}
                          </button>
                        )}
                        {slot.status !== 'booked' && (
                          <button className="csl-slot-remove" onClick={() => removeSlot(slot)} title="Remove slot">
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
