import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const response = await axios.post("http://localhost:3000/api/auth/food-partner/login", {
        email,
        password
      }, { withCredentials: true });

      const { foodPartner } = response.data;
      navigate(`/profile/${foodPartner._id}`);
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (err.response?.status === 400) {
        setError('Please enter both email and password.');
      } else {
        setError('Login failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-brand">
          <div className="auth-logo-title">Plates &amp; Partners</div>
          
          <div className="auth-heading">
            <div className="auth-eyebrow">For food partners</div>
            <h1 className="auth-title">Partner dashboard</h1>
            <p className="auth-subtitle">
              Log in to manage orders, menus, and track your restaurant's performance.
            </p>
          </div>

          <p className="auth-footer-note">
            Want to place an order?{' '}
            <Link className="auth-toggle-link" to="/user/login">
              Log in as a user
            </Link>
          </p>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-card">
            <div className="auth-form-header">
              <h2 className="auth-form-title">Food partner login</h2>
              <p className="auth-form-description">
                Use your work email and password to access your dashboard.
              </p>
            </div>

            <div className="auth-tabs">
              <Link to="/user/login" className="auth-tab">
                User
              </Link>
              <Link to="/food-partner/login" className="auth-tab auth-tab--active">
                Food partner
              </Link>
            </div>

            <div className="auth-toggle-row">
              <span className="auth-toggle-label">New partner?</span>
              <Link to="/food-partner/register" className="auth-toggle-link">
                Create an account
              </Link>
            </div>

            <hr className="auth-divider" />

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-label" htmlFor="partnerIdentifier">
                  Work email
                </label>
                <input
                  id="partnerIdentifier"
                  name="partnerIdentifier"
                  type="email"
                  autoComplete="email"
                  className="field-input"
                  placeholder="contact@restaurant.com"
                />
              </div>

              <div className="field">
                <label className="field-label" htmlFor="partnerLoginPassword">
                  Password
                </label>
                <input
                  id="partnerLoginPassword"
                  name="partnerLoginPassword"
                  type="password"
                  autoComplete="current-password"
                  className="field-input"
                  placeholder="Enter your password"
                />
              </div>

              <div className="auth-actions">
                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? 'Logging in...' : 'Log in'}
                </button>

                <p className="secondary-link">
                  <a href="#">Forgot password?</a>
                </p>
              </div>

              <div className="auth-meta">
                <span>For shared outlets, you can create team logins from your dashboard.</span>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}

export default FoodPartnerLogin

