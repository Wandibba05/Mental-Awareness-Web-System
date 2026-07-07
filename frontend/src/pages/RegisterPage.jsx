import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import '../styles/RegisterPage.css';

const roles = [
  { id: 'student',    label: 'Student',    icon: '🎓', color: '#1d4ed8' },
  { id: 'counsellor', label: 'Counsellor', icon: '🩺', color: '#065f46' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('student');
  const [fullName, setFullName]         = useState('');
  const [email, setEmail]               = useState('');
  const [phoneNumber, setPhoneNumber]   = useState('');
  const [specialisation, setSpecialisation] = useState('');
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState(false);

  const activeRole = roles.find((r) => r.id === selectedRole);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (selectedRole === 'counsellor' && !specialisation) {
      setError('Please enter your specialisation.');
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        role: selectedRole,
        fullName,
        email,
        phoneNumber,
        password,
        specialisation: selectedRole === 'counsellor' ? specialisation : undefined,
      });

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="reg-page">
        <div className="reg-success-card">
          <div style={{ fontSize: '52px' }}>🎉</div>
          <h2>Account created successfully!</h2>
          {selectedRole === 'counsellor' ? (
            <p>Your counsellor account has been created and is <strong>awaiting admin approval</strong>. You will be able to log in once an administrator reviews and approves your account.</p>
          ) : (
            <p>Your student account has been created successfully. You can now log in to access the platform.</p>
          )}
          <button className="reg-login-btn" style={{ background: activeRole.color }} onClick={() => navigate('/login')}>
            → Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reg-page">
      <div className="reg-card">

        {/* Header */}
        <div className="reg-header">
          <div className="reg-brand">💚 MindCare</div>
          <h1 className="reg-title">Create your account</h1>
          <p className="reg-sub">Join the MindCare platform and start your mental health journey</p>
        </div>

        {/* Role selector */}
        <div className="reg-role-row">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`reg-role-btn ${selectedRole === r.id ? 'active' : ''}`}
              style={selectedRole === r.id ? { borderColor: r.color, background: `${r.color}12`, color: r.color } : {}}
              onClick={() => setSelectedRole(r.id)}
            >
              <span>{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>

        {/* Counsellor notice */}
        {selectedRole === 'counsellor' && (
          <div className="reg-notice">
            ℹ️ Counsellor accounts require admin approval before you can log in. You will be notified once approved.
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="reg-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="reg-form">

          <div className="reg-field">
            <label className="reg-label">Full name</label>
            <input
              className="reg-input"
              type="text"
              placeholder="e.g. Jane Wanjiru"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="reg-field">
            <label className="reg-label">Email address</label>
            <input
              className="reg-input"
              type="email"
              placeholder={selectedRole === 'counsellor' ? 'e.g. jane@clinic.ac.ke' : 'e.g. jane@university.ac.ke'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="reg-field">
            <label className="reg-label">Phone number</label>
            <input
              className="reg-input"
              type="tel"
              placeholder="e.g. 0712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          {selectedRole === 'counsellor' && (
            <div className="reg-field">
              <label className="reg-label">Specialisation</label>
              <input
                className="reg-input"
                type="text"
                placeholder="e.g. Anxiety, Depression, CBT"
                value={specialisation}
                onChange={(e) => setSpecialisation(e.target.value)}
                required
              />
            </div>
          )}

          <div className="reg-field">
            <label className="reg-label">Password</label>
            <div className="reg-input-wrap">
              <input
                className="reg-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="reg-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="reg-field">
            <label className="reg-label">Confirm password</label>
            <input
              className="reg-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="reg-submit-btn"
            style={{ background: activeRole.color }}
            disabled={loading}
          >
            {loading ? '⏳ Creating account...' : `${activeRole.icon} Create ${activeRole.label.toLowerCase()} account`}
          </button>

        </form>

        {/* Login link */}
        <div className="reg-login-link">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: activeRole.color, fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
          >
            Sign in here
          </button>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;