import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const UserRegister = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
  e.preventDefault();
  const firstName = e.target.firstName.value;
  const lastName = e.target.lastName.value;
  const email = e.target.email.value;
  const password = e.target.password.value;

  const response = await axios.post("http://localhost:3000/api/auth/user/register",{
    fullName:firstName+" "+lastName,
    email,
    password
  },{
    withCredentials:true
  })
  console.log(response.data);
  navigate('/')
};

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-brand">
          <div className="auth-logo-title">Plates &amp; Partners</div>
          
          <div className="auth-heading">
            <div className="auth-eyebrow">For diners</div>
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">
              Sign up to save your favorite dishes, track orders, and reorder quickly.
            </p>
          </div>

          <p className="auth-footer-note">
            Looking to onboard your restaurant?{' '}
            <Link className="auth-toggle-link" to="/food-partner/register">
              Register as a food partner
            </Link>
          </p>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-card">
            <div className="auth-form-header">
              <h2 className="auth-form-title">User sign up</h2>
              <p className="auth-form-description">
                Start with the basics. You can complete your profile later.
              </p>
            </div>

            <div className="auth-tabs">
              <Link to="/user/register" className="auth-tab auth-tab--active">
                User
              </Link>
              <Link to="/food-partner/register" className="auth-tab">
                Food partner
              </Link>
            </div>

            <div className="auth-toggle-row">
              <span className="auth-toggle-label">Already have an account?</span>
              <Link to="/user/login" className="auth-toggle-link">
                Log in
              </Link>
            </div>

            <hr className="auth-divider" />

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="field-row">
                <div className="field">
                  <label className="field-label" htmlFor="firstName">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    className="field-input"
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="lastName">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    className="field-input"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="field">
                <label className="field-label" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
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
                  autoComplete="new-password"
                  className="field-input"
                  placeholder="Create a password"
                />
                <p className="field-hint">At least 8 characters</p>
              </div>

              <div className="auth-actions">
                <button type="submit" className="primary-btn" onSubmit={handleSubmit}>
                  Create account
                </button>

                <p className="secondary-link">
                  By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy policy</a>
                </p>
              </div>

              <div className="auth-meta">
                <span>We only use your details for order-related communication.</span>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}

export default UserRegister

