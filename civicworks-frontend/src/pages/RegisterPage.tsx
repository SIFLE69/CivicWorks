import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="brand-link">
            <img src="/logo.png" alt="CivicWorks" className="auth-logo-img" />
            <span className="brand-text">CivicWorks</span>
          </Link>
        </div>

        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join the community and start reporting civic issues</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-submit">Create Account</button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #eef0f3 0%, #e2e5e9 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          position: relative;
        }
        .auth-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 25% 25%, rgba(17, 24, 39, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(17, 24, 39, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }
        .auth-container {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 1;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .brand-link {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: #111827;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.025em;
        }
        .brand-text {
          color: #111827;
        }
        .auth-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 
            0 20px 50px -10px rgba(0, 0, 0, 0.1),
            0 10px 20px -5px rgba(0, 0, 0, 0.05),
            0 0 0 1px rgba(0, 0, 0, 0.03);
          border: 1px solid #e5e7eb;
        }
        .auth-card h2 {
          margin: 0 0 0.5rem 0;
          font-size: 1.75rem;
          color: #111827;
          font-weight: 800;
          letter-spacing: -0.025em;
        }
        .auth-subtitle {
          margin: 0 0 2rem 0;
          color: #6b7280;
          font-size: 0.95rem;
        }
        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 0.875rem 1rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          border: 1px solid #fecaca;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }
        .form-group input {
          padding: 0.875rem 1rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.2s;
          background: #fafafa;
        }
        .form-group input:focus {
          outline: none;
          border-color: #111827;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
          background: #ffffff;
        }
        .form-group input::placeholder {
          color: #9ca3af;
        }
        .btn-submit {
          background: #111827;
          color: white;
          padding: 1rem;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 0.5rem;
        }
        .btn-submit:hover {
          background: #1f2937;
          transform: translateY(-1px);
          box-shadow: 0 10px 25px -5px rgba(17, 24, 39, 0.25);
        }
        .btn-submit:active {
          transform: translateY(0);
        }
        .auth-footer {
          margin-top: 1.5rem;
          text-align: center;
          color: #6b7280;
          font-size: 0.9rem;
        }
        .auth-link {
          color: #111827;
          text-decoration: none;
          font-weight: 600;
          border-bottom: 2px solid #e5e7eb;
          transition: border-color 0.2s;
        }
        .auth-link:hover {
          border-color: #111827;
        }
        
        @media (max-width: 480px) {
          .auth-page {
            padding: 1rem;
          }
          .auth-card {
            padding: 1.75rem;
            border-radius: 16px;
          }
          .auth-card h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
