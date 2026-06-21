import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/AdminSidebar.css';

const navItems = [
  { icon: '🏠', label: 'Dashboard',    path: '/admin/dashboard' },
  { icon: '👥', label: 'Manage users', path: '/admin/users'     },
  { icon: '📊', label: 'Reports',      path: '/admin/reports'   },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <aside className="as-sidebar">
      {/* Brand */}
      <div className="as-brand">
        <span className="as-brand-icon">💚</span>
        <div>
          <div className="as-brand-name">MindCare</div>
          <div className="as-brand-sub">Admin portal</div>
        </div>
      </div>

      {/* Profile */}
      <div className="as-profile">
        <div className="as-avatar">A</div>
        <div>
          <div className="as-name">Administrator</div>
          <div className="as-role">System admin</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="as-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`as-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="as-nav-icon">{item.icon}</span>
            <span className="as-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="as-footer">
        <button className="as-logout-btn" onClick={handleLogout}>
          <span className="as-nav-icon">🚪</span>
          <span className="as-nav-label">Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;