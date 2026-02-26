import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setProfilePhoto(file);
      setError('');
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  const restaurantName = e.target.restaurantName.value.trim();
  const contactName = e.target.contactName.value.trim();
  const partnerEmail = e.target.partnerEmail.value.trim();
  const partnerPhone = e.target.partnerPhone.value.trim();
  const address = e.target.address.value.trim();
  const partnerPassword = e.target.partnerPassword.value;

  // Validation
  if (!restaurantName || !contactName || !partnerEmail || !partnerPhone || !address || !partnerPassword) {
    setError('Please fill all required fields');
    setLoading(false);
    return;
  }

  if (!profilePhoto) {
    setError('Please upload a profile photo');
    setLoading(false);
    return;
  }

  // Validate phone number format
  if (partnerPhone.length < 10 || isNaN(partnerPhone)) {
    setError('Please enter a valid phone number');
    setLoading(false);
    return;
  }

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('name', restaurantName);
  formData.append('contactName', contactName);
  formData.append('email', partnerEmail);
  formData.append('phone', partnerPhone);
  formData.append('address', address);
  formData.append('password', partnerPassword);
  formData.append('profilePhoto', profilePhoto);

  try {
    const response = await axios.post("http://localhost:3000/api/auth/food-partner/register", formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response.data);
    navigate(`/profile/${response.data.foodPartner._id}`);
  } catch (err) {
    // Show more detailed error message
    const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
    setError(errorMessage);
    console.error('Registration error:', err.response?.data || err);
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
            <h1 className="auth-title">Onboard your restaurant</h1>
            <p className="auth-subtitle">
              Sign up to accept orders, manage your menu, and track your business.
            </p>
          </div>

          <p className="auth-footer-note">
            Want to order instead?{' '}
            <Link className="auth-toggle-link" to="/user/register">
              Register as a user
            </Link>
          </p>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-card">
            <div className="auth-form-header">
              <h2 className="auth-form-title">Food partner sign up</h2>
              <p className="auth-form-description">
                Start with your primary outlet details. You can add more locations later.
              </p>
            </div>

            <div className="auth-tabs">
              <Link to="/user/register" className="auth-tab">
                User
              </Link>
              <Link to="/food-partner/register" className="auth-tab auth-tab--active">
                Food partner
              </Link>
            </div>

            <div className="auth-toggle-row">
              <span className="auth-toggle-label">Already a partner?</span>
              <Link to="/food-partner/login" className="auth-toggle-link">
                Log in
              </Link>
            </div>

            <hr className="auth-divider" />

            {error && (
              <div className="auth-error-message">
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              {/* Profile Photo Upload */}
              <div className="field">
                <label className="field-label" htmlFor="profilePhoto">
                  Profile Photo <span className="field-required">*</span>
                </label>
                <div className="profile-photo-upload-container">
                  <div className="profile-photo-upload">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="profile-photo-preview" />
                    ) : (
                      <div className="profile-photo-placeholder">
                        <span className="profile-photo-icon">📷</span>
                        <span className="profile-photo-text">Click to upload</span>
                      </div>
                    )}
                    <input
                      id="profilePhoto"
                      name="profilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="profile-photo-input"
                      required
                    />
                  </div>
                  <p className="field-hint">Upload your restaurant logo or photo (max 5MB)</p>
                </div>
              </div>

              {/* Restaurant Name */}
              <div className="field">
                <label className="field-label" htmlFor="restaurantName">
                  Restaurant Name <span className="field-required">*</span>
                </label>
                <input
                  id="restaurantName"
                  name="restaurantName"
                  type="text"
                  className="field-input"
                  placeholder="Your restaurant name"
                  required
                  autoComplete="organization"
                />
              </div>

              {/* Owner Name */}
              <div className="field">
                <label className="field-label" htmlFor="contactName">
                  Owner Name <span className="field-required">*</span>
                </label>
                <input
                  id="contactName"
                  name="contactName"
                  type="text"
                  className="field-input"
                  placeholder="Owner or manager name"
                  required
                  autoComplete="name"
                />
              </div>

              {/* Email and Phone Row */}
              <div className="field-row">
                <div className="field">
                  <label className="field-label" htmlFor="partnerEmail">
                    Work Email <span className="field-required">*</span>
                  </label>
                  <input
                    id="partnerEmail"
                    name="partnerEmail"
                    type="email"
                    autoComplete="email"
                    className="field-input"
                    placeholder="contact@restaurant.com"
                    required
                  />
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="partnerPhone">
                    Phone <span className="field-required">*</span>
                  </label>
                  <input
                    id="partnerPhone"
                    name="partnerPhone"
                    type="tel"
                    autoComplete="tel"
                    className="field-input"
                    placeholder="+91 1234567890"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="field">
                <label className="field-label" htmlFor="address">
                  Address <span className="field-required">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  className="field-input"
                  placeholder="Street, area, city"
                  required
                />
                <p className="field-hint">
                  Helps us calculate delivery zones and show relevant orders.
                </p>
              </div>

              {/* Password */}
              <div className="field">
                <label className="field-label" htmlFor="partnerPassword">
                  Password <span className="field-required">*</span>
                </label>
                <input
                  id="partnerPassword"
                  name="partnerPassword"
                  type="password"
                  autoComplete="new-password"
                  className="field-input"
                  placeholder="Create a password"
                  required
                  minLength={8}
                />
                <p className="field-hint">At least 8 characters</p>
              </div>

              <div className="auth-actions">
                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create partner account'}
                </button>

                <p className="secondary-link">
                  By continuing, you confirm you are authorized to represent this restaurant.
                </p>
              </div>

              <div className="auth-meta">
                <span>Need to register multiple outlets? Contact our team.</span>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}

export default FoodPartnerRegister