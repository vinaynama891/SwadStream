import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import axios  from 'axios'
import {useNavigate} from 'react-router-dom'
import cookies from 'js-cookie'


const UserLogin = ({setMainToken}) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e)=>{
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const email =  e.target.email.value;
    const password = e.target[1].value;

    try {
      const response = await axios.post("http://localhost:3000/api/auth/user/login",{
        email,
        password
      },{
        withCredentials:true
      });

      setToken(response.data.token);
      setMainToken(response.data.token);
      console.log('Login successful, token:', response.data.token);
      console.log("Hello", response.data);
      navigate('/dashboard');
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
            <div className="auth-eyebrow">For diners</div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">
              Log in to access your saved addresses, past orders, and favorites.
            </p>
          </div>

          <p className="auth-footer-note">
            Onboarding a restaurant?{' '}
            <Link className="auth-toggle-link" to="/food-partner/login">
              Log in as a food partner
            </Link>
          </p>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-card">
            <div className="auth-form-header">
              <h2 className="auth-form-title">User login</h2>
              
            </div>

            <div className="auth-tabs">
              <Link to="/user/login" className="auth-tab auth-tab--active">
                User
              </Link>
              <Link to="/food-partner/login" className="auth-tab">
                Food partner
              </Link>
            </div>

            <div className="auth-toggle-row">
              <span className="auth-toggle-label">New here?</span>
              <Link to="/user/register" className="auth-toggle-link">
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
                <label className="field-label" htmlFor="identifier">
                  Email
                </label>
                <input
                  id="identifier"
                  name="email"
                  type="text"
                  autoComplete="email"
                  className="field-input"
                  placeholder="you@example.com"
                />
              </div>

              <div className="field">
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
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
                  <a href="#">Forgot your password?</a>
                </p>
              </div>

              <div className="auth-meta">
                <span>Prefer to browse first? You can order as a guest.</span>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}


export default UserLogin