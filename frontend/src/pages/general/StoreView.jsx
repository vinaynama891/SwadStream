import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE = 'http://localhost:3000/api'

const StoreView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [businessData, setBusinessData] = useState({
    businessName: 'Business name',
    address: 'Address',
    totalMeals: 43,
    customersServed: '15K',
    profilePhoto: null
  })
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      axios.get(`${API_BASE}/auth/food-partner/${id}`,{ withCredentials: true })
        .then(res => {
          setBusinessData({
            businessName: res.data.name || 'Business name',
            address: res.data.address || 'Address',
            totalMeals: 43,
            customersServed: '15K',
            profilePhoto: res.data.profilePhoto || null
          })
        })
        .catch(() => {})

      axios.get(`${API_BASE}/food/partner/${id}`, { withCredentials: true })
        .then(res => {
          setVideos(res.data.foodItems || [])
        })
        .catch(() => setVideos([]))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [id])

  return (
    <div className="profile-page">
      <button 
        className="back-button profile-back-button"
        onClick={() => navigate(-1)}
        title="Go Back"
      >
        ← Back
      </button>
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
  className="back-button profile-back-button"
  title="Order Now"
  onClick={() => navigate(`/restaurant/${id}`)}  // <-- changed
>
  Order Now
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

export default StoreView