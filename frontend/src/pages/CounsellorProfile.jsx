import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CounsellorSidebar from '../components/CounsellorSidebar';
import '../styles/CounsellorProfile.css';
import '../styles/CounsellorSidebar.css';

const menuItems = [
  { id: 'edit',     icon: '✏️', title: 'Edit profile',         sub: 'Name, bio, specialisation',     color: '#d1fae5', iconColor: '#065f46' },
  { id: 'hours',    icon: '🕐', title: 'Working hours',        sub: 'Set your weekly availability',  color: '#dbeafe', iconColor: '#1d4ed8' },
  { id: 'notif',    icon: '🔔', title: 'Notifications',        sub: 'Booking alerts and reminders',  color: '#fef3c7', iconColor: '#92400e' },
  { id: 'privacy',  icon: '🔒', title: 'Privacy and security', sub: 'Password, 2FA',                 color: '#f3e8ff', iconColor: '#6b21a8' },
  { id: 'help',     icon: '❓', title: 'Help and support',     sub: 'Contact admin',                 color: '#f2f4f7', iconColor: '#667085' },
];

const CounsellorProfile = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [name, setName] = useState('Dr. Amina Kariuki');
  const [specialisation, setSpecialisation] = useState('Anxiety, Stress, CBT Specialist');
  const [bio, setBio] = useState('Licensed counsellor with 6 years of experience helping students manage anxiety, stress and academic pressure using evidence-based CBT techniques.');

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex' }}>
      <CounsellorSidebar />
      <div style={{ marginLeft: '240px', flex: 1 }}>
        <div className="cp-page">

          {/* Profile header */}
          <div className="cp-header">
            <button className="cp-back-btn" onClick={() => navigate('/counsellor/dashboard')}>
              ← Back to dashboard
            </button>
            <div className="cp-avatar-large">AK</div>
            <h1 className="cp-name">{name}</h1>
            <p className="cp-spec">{specialisation}</p>
            <div className="cp-stats-row">
              <div className="cp-stat">
                <div className="cp-stat-value">84</div>
                <div className="cp-stat-label">Sessions</div>
              </div>
              <div className="cp-stat-divider" />
              <div className="cp-stat">
                <div className="cp-stat-value">4.8 ★</div>
                <div className="cp-stat-label">Rating</div>
              </div>
              <div className="cp-stat-divider" />
              <div className="cp-stat">
                <div className="cp-stat-value">2 yrs</div>
                <div className="cp-stat-label">Active</div>
              </div>
            </div>
          </div>

          <div className="cp-content">

            {/* Bio card */}
            <div className="cp-bio-card">
              <div className="cp-bio-label">About</div>
              <p className="cp-bio-text">{bio}</p>
            </div>

            {/* Menu list */}
            <div className="cp-menu-card">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className="cp-menu-item"
                  onClick={() => setActiveModal(item.id)}
                >
                  <div className="cp-menu-icon" style={{ background: item.color }}>
                    {item.icon}
                  </div>
                  <div className="cp-menu-text">
                    <div className="cp-menu-title">{item.title}</div>
                    <div className="cp-menu-sub">{item.sub}</div>
                  </div>
                  <span className="cp-menu-arrow">→</span>
                </button>
              ))}
            </div>

            {/* Logout */}
            <button className="cp-logout-btn" onClick={handleLogout}>
              🚪 Log out
            </button>

          </div>

          {/* Edit profile modal */}
          {activeModal === 'edit' && (
            <div className="cp-modal-overlay" onClick={() => setActiveModal(null)}>
              <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cp-modal-header">
                  <h2>Edit profile</h2>
                  <button className="cp-modal-close" onClick={() => setActiveModal(null)}>✕</button>
                </div>
                <div className="cp-modal-body">
                  <div className="cp-form-group">
                    <label className="cp-form-label">Full name</label>
                    <input className="cp-form-input" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="cp-form-group">
                    <label className="cp-form-label">Specialisation</label>
                    <input className="cp-form-input" value={specialisation} onChange={(e) => setSpecialisation(e.target.value)} />
                  </div>
                  <div className="cp-form-group">
                    <label className="cp-form-label">Bio</label>
                    <textarea className="cp-form-textarea" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} />
                  </div>
                </div>
                <div className="cp-modal-footer">
                  <button className="cp-modal-cancel" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button className="cp-modal-save" onClick={() => setActiveModal(null)}>Save changes</button>
                </div>
              </div>
            </div>
          )}

          {/* Other simple modals */}
          {activeModal && activeModal !== 'edit' && (
            <div className="cp-modal-overlay" onClick={() => setActiveModal(null)}>
              <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cp-modal-header">
                  <h2>{menuItems.find((m) => m.id === activeModal)?.title}</h2>
                  <button className="cp-modal-close" onClick={() => setActiveModal(null)}>✕</button>
                </div>
                <div className="cp-modal-body">
                  <p className="cp-modal-placeholder">
                    This section is coming soon. It will let you manage {menuItems.find((m) => m.id === activeModal)?.sub.toLowerCase()}.
                  </p>
                </div>
                <div className="cp-modal-footer">
                  <button className="cp-modal-save" onClick={() => setActiveModal(null)}>Close</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CounsellorProfile;
