import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE = 'http://localhost:3000/api'

const Profile = () => {
  const { id } = useParams()
  const [businessData, setBusinessData] = useState({
    businessName: 'Business name',
    address: 'Address',
    totalMeals: 43,
    customersServed: '15K',
    profilePhoto: null
  })
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [currentPartner, setCurrentPartner] = useState(null)

  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE}/auth/food-partner/logout`, { withCredentials: true });
      Cookies.remove('token');
      navigate('/food-partner/login');
    } catch (err) {
      console.error('Logout failed:', err);
      // Still remove cookie and navigate
      Cookies.remove('token');
      navigate('/food-partner/login');
    }
  };

  useEffect(() => {
    console.log('Profile id:', id);
    if (id) {
      const fetchData = async () => {
        try {
          const [partnerRes, foodRes, meRes] = await Promise.allSettled([
            axios.get(`${API_BASE}/auth/food-partner/${id}`, { withCredentials: true }),
            axios.get(`${API_BASE}/food/partner/${id}`, { withCredentials: true }),
            axios.get(`${API_BASE}/auth/food-partner/me`, { withCredentials: true })
          ]);

          if (partnerRes.status === 'fulfilled') {
            setBusinessData({
              businessName: partnerRes.value.data.name || 'Business name',
              address: partnerRes.value.data.address || 'Address',
              totalMeals: 43,
              customersServed: '15K',
              profilePhoto: partnerRes.value.data.profilePhoto || null
            });
          }

          if (foodRes.status === 'fulfilled') {
            setVideos(foodRes.value.data.foodItems || []);
          } else {
            setVideos([]);
          }

          if (meRes.status === 'fulfilled') {
            console.log('Current partner:', meRes.value.data.foodPartner);
            setCurrentPartner(meRes.value.data.foodPartner);
          } else {
            console.log('Error getting current partner:', meRes.reason);
            setCurrentPartner(null);
          }
        } catch (err) {
          console.error('Error fetching data:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
    }
  }, [id])

  return (
    <div className="profile-page">
      <div className="profile-header-card">
        <div className="profile-header-top">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-circle">
              {businessData.profilePhoto ? (
                <img src={businessData.profilePhoto} alt="Profile" className="profile-avatar-image" />
              ) : (
                <div className="profile-avatar-placeholder">📷</div>
              )}
            </div>
            <button
            onClick={handleLogout}
            className="back-button profile-back-button"
            title="Logout"
          >
            Logout
          </button>
          </div>

          <div className="profile-info-container">
            <div className="profile-info-field">{businessData.businessName}</div>
            <div className="profile-info-field">{businessData.address}</div>
          </div>
        </div>

        <div className="profile-stats-container">
          <div className="profile-stat">
            <div className="profile-stat-label">total meals</div>

            <div className="profile-stat-number">{businessData.totalMeals}</div>
          </div>
          <button
            onClick={() => navigate('/create-food')}
            className="profile-upload-reel-btn-bottom"
            title="Create Food Partner"
          >
            <i className="fa-solid fa-upload"></i>
          </button>
          <div className="profile-stat">
            <div className="profile-stat-label">customer serve</div>
            <div className="profile-stat-number">{businessData.customersServed}</div>
          </div>
        </div>
      </div>

      <div className="profile-videos-container">
        <div className="profile-videos-grid">
          {loading ? (
            Array(6).fill(null).map((_, i) => (
              <div key={i} className="profile-video-item">
                <div className="profile-video-placeholder">Loading...</div>
              </div>
            ))
          ) : videos.length > 0 ? (
            videos.map((video) => (
              <div key={video._id} className="profile-video-item">
                <video
                  src={video.video}
                  className="profile-video-element"
                  muted
                  playsInline
                  controls
                  loop
                />
              </div>
            ))
          ) : (
            <div className="profile-no-videos">No videos uploaded yet</div>
          )}
        </div>
      </div>


    </div>
  )
}

export default Profile