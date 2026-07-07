import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [activeRole, setActiveRole] = useState('student');
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      label: 'Student',
      icon: '🎓',
      color: '#1d4ed8',
      lightColor: '#dbeafe',
      borderColor: '#93c5fd',
      badge: 'Student Portal',
      heading: 'Welcome back',
      subheading: 'Sign in to your student account',
      emailPlaceholder: 'student@university.ac.ke',
      altLogin: 'Use Student ID',
      footer: "Don't have an account?",
      footerLink: 'Register here',
      dashboard: '/student/dashboard',
    },
    {
      id: 'counsellor',
      label: 'Counsellor',
      icon: '🩺',
      color: '#065f46',
      lightColor: '#d1fae5',
      borderColor: '#6ee7b7',
      badge: 'Counsellor Portal',
      heading: 'Counsellor sign in',
      subheading: 'Access your counselling dashboard',
      emailPlaceholder: 'counsellor@clinic.ac.ke',
      altLogin: 'Use Staff Credentials',
      footer: 'Having trouble signing in?',
      footerLink: 'Contact IT support',
      dashboard: '/counsellor/dashboard',
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: '🛡️',
      color: '#92400e',
      lightColor: '#fef3c7',
      borderColor: '#fcd34d',
      badge: 'Admin Portal',
      heading: 'Administrator login',
      subheading: 'Authorised personnel only',
      emailPlaceholder: 'admin@institution.ac.ke',
      altLogin: 'Use Security Key',
      footer: 'Access issues?',
      footerLink: 'Contact system admin',
      dashboard: '/admin/dashboard',
      requires2FA: true,
    },
  ];

  const currentRole = roles.find((r) => r.id === activeRole);

  return (
    <div className="login-page" style={{ '--role-color': currentRole.color, '--role-light': currentRole.lightColor, '--role-border': currentRole.borderColor }}>
      <div className="login-card">

        {/* Role tab switcher */}
        <div className="role-tabs">
          {roles.map((role) => (
            <button
              key={role.id}
              className={`role-tab ${activeRole === role.id ? 'active' : ''}`}
              style={activeRole === role.id ? { background: currentRole.color === role.color ? role.color : '#f3f4f6', color: role.color === currentRole.color ? '#fff' : '#6b7280', borderBottom: `3px solid ${role.color}` } : {}}
              onClick={() => setActiveRole(role.id)}
            >
              <span className="tab-icon">{role.icon}</span>
              {role.label}
            </button>
          ))}
        </div>

        {/* Card header */}
        <div className="card-header" style={{ background: currentRole.lightColor, borderBottom: `1.5px solid ${currentRole.borderColor}` }}>
          <div className="header-icon" style={{ background: '#fff', border: `2px solid ${currentRole.borderColor}` }}>
            <span style={{ fontSize: '28px' }}>{currentRole.icon}</span>
          </div>
          <span className="role-badge" style={{ background: currentRole.color, color: '#fff' }}>
            {currentRole.badge}
          </span>
          <h2 className="card-heading">{currentRole.heading}</h2>
          <p className="card-subheading">{currentRole.subheading}</p>
        </div>

        {/* Login form */}
        <LoginForm
          role={currentRole}
          navigate={navigate}
        />

        {/* Footer */}
        <div className="card-footer">
          <span>{currentRole.footer} </span>
          {activeRole === 'student' ? (
            <button
              type="button"
              onClick={() => navigate('/register')}
              style={{ background: 'none', border: 'none', color: currentRole.color, fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
            >
              {currentRole.footerLink}
            </button>
          ) : (
            <a href="#!" style={{ color: currentRole.color, fontWeight: '700' }}>
              {currentRole.footerLink}
            </a>
          )}
        </div>

        {/* Register link for counsellors too */}
        {activeRole === 'counsellor' && (
          <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '13px', color: '#667085' }}>
            New counsellor?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              style={{ background: 'none', border: 'none', color: currentRole.color, fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
            >
              Register here
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginPage;