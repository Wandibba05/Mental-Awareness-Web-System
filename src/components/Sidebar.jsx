import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const navItems = [
  { icon: '🏠', label: 'Dashboard',    path: '/student/dashboard' },
  { icon: '🧠', label: 'Mood Check-in', path: '/student/mood'      },
  { icon: '📅', label: 'Sessions',      path: '/student/sessions'  },
  { icon: '📚', label: 'Resources',     path: '/student/resources' },
];

const Sidebar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => {
    // TODO: clear auth token when backend is connected
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo / brand */}
      <div className="sidebar-brand">
        <span className="brand-icon">💚</span>
        <div>
          <div className="brand-name">MindCare</div>
          <div className="brand-sub">Student portal</div>
        </div>
      </div>

      {/* Student profile mini */}
      <div className="sidebar-profile">
        <div className="profile-avatar">S</div>
        <div>
          <div className="profile-name">Student</div>
          <div className="profile-role">Logged in</div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;