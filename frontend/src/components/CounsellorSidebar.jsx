import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/CounsellorSidebar.css';

const navItems = [
  { icon: '🏠', label: 'Dashboard',  path: '/counsellor/dashboard' },
  { icon: '📋', label: 'Sessions',   path: '/counsellor/sessions'  },
  { icon: '🕐', label: 'My slots',   path: '/counsellor/slots'     },
  { icon: '📝', label: 'Notes',      path: '/counsellor/notes'     },
  { icon: '👤', label: 'Profile',    path: '/counsellor/profile'   },
];

const CounsellorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <aside className="cs-sidebar">
      {/* Brand */}
      <div className="cs-brand">
        <span className="cs-brand-icon">💚</span>
        <div>
          <div className="cs-brand-name">MindCare</div>
          <div className="cs-brand-sub">Counsellor portal</div>
        </div>
      </div>

      {/* Profile */}
      <div className="cs-profile">
        <div className="cs-avatar">AK</div>
        <div>
          <div className="cs-name">Dr. Amina Kariuki</div>
          <div className="cs-role">Anxiety & Stress · CBT</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="cs-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`cs-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="cs-nav-icon">{item.icon}</span>
            <span className="cs-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="cs-footer">
        <button className="cs-logout-btn" onClick={handleLogout}>
          <span className="cs-nav-icon">🚪</span>
          <span className="cs-nav-label">Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default CounsellorSidebar;