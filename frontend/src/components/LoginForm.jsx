import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';
import { loginUser, verifyTwoFactor } from '../api';

function LoginForm({ role }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFA, setTwoFA] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [awaitingTwoFactor, setAwaitingTwoFactor] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // If admin is on the 2FA verification step
    if (awaitingTwoFactor) {
      if (!twoFA) {
        setError('Please enter the verification code sent to your email.');
        return;
      }

      setLoading(true);

      try {
        const data = await verifyTwoFactor(email, twoFA);

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));

        setLoading(false);
        navigate('/admin/dashboard');
      } catch (err) {
        setLoading(false);
        setError(
          err.response?.data?.message ||
            'Invalid verification code. Please try again.'
        );
      }

      return;
    }

    // Normal login for all roles
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(role.id, email, password);

      // Admin requires 2FA verification
      if (data.requiresTwoFactor) {
        setLoading(false);
        setAwaitingTwoFactor(true);
        setError('');
        return;
      }

      // Student and counsellor log in directly
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      setLoading(false);

      if (role.id === 'student') {
        navigate('/student/mood');
      } else if (role.id === 'counsellor') {
        navigate('/counsellor/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>

      {/* Error message */}
      {error && (
        <div className="error-banner">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Email field */}
      <div className="field-group">
        <label className="field-label">
          {role.id === 'counsellor'
            ? 'Work email'
            : role.id === 'admin'
            ? 'Admin email'
            : 'Student email'}
        </label>

        <div className="field-input-wrap">
          <span className="field-icon">✉️</span>

          <input
            type="email"
            className="field-input"
            placeholder={role.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
      </div>

      {/* Password field */}
      {!awaitingTwoFactor && (
        <div className="field-group">
          <label className="field-label">Password</label>

          <div className="field-input-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              className="field-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#667085"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#667085"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 2FA Field */}
      {awaitingTwoFactor && (
        <div className="field-group">
          <label className="field-label">
            📧 Check your email for the verification code
          </label>

          <p
            style={{
              fontSize: '12px',
              color: '#667085',
              margin: '0 0 8px',
            }}
          >
            A 6-digit verification code has been sent to{' '}
            <strong>{email}</strong>. It expires in 10 minutes.
          </p>

          <div className="field-input-wrap">
            <span className="field-icon">🔑</span>

            <input
              type="text"
              className="field-input"
              placeholder="Enter 6-digit code"
              value={twoFA}
              onChange={(e) => setTwoFA(e.target.value)}
              maxLength={6}
              required
            />
          </div>
        </div>
      )}

      {/* Remember me */}
      {!awaitingTwoFactor && (
        <div className="options-row">
          <label className="remember-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="remember-checkbox"
            />
            <span>Remember me</span>
          </label>

          <a
            href="#!"
            className="forgot-link"
            style={{ color: role.color }}
          >
            Forgot password?
          </a>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        className="submit-btn"
        style={{ background: role.color }}
        disabled={loading}
      >
        {loading ? (
          <span className="loading-spinner">
            ⏳ {awaitingTwoFactor ? 'Verifying...' : 'Signing in...'}
          </span>
        ) : awaitingTwoFactor ? (
          'Verify Code'
        ) : role.id === 'admin' ? (
          '🛡️ Secure Sign In'
        ) : (
          '→ Sign In'
        )}
      </button>

      {!awaitingTwoFactor && (
        <>
          <div className="divider">
            <span>or</span>
          </div>

          <button
            type="button"
            className="alt-btn"
            style={{
              border: `1.5px solid ${role.color}`,
              color: role.color,
            }}
          >
            {role.altLogin}
          </button>
        </>
      )}
    </form>
  );
}

export default LoginForm;