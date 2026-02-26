import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE = 'http://localhost:3000/api'

const Restaurant = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
    Promise.all([
      axios.get(`${API_BASE}/auth/food-partner/${id}`, { withCredentials: true }),
      axios.get(`${API_BASE}/food/partner/${id}`, { withCredentials: true })
    ])
      .then(([res1, res2]) => {
        setRestaurant(res1.data)
        setReels(res2.data.foodItems || [])
      })
      .catch(() => {
        setRestaurant(null)
        setReels([])
      })
      .finally(() => setLoading(false))
    }
    fetchData()

    // Try to get current user
    axios.get(`${API_BASE}/auth/user/me`, { withCredentials: true })
      .then(res => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null))
  }, [id])

  return (
    <div className="restaurant-page">
      <header className="restaurant-header">
        <button type="button" className="restaurant-back" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="restaurant-name">{restaurant.name}</h1>
        <p className="restaurant-owner">By {restaurant.contactName}</p>
        {restaurant.address && <p className="restaurant-address">📍 {restaurant.address}</p>}
      </header>

      {/* Order food */}
      <section className="restaurant-section">
        <h2 className="restaurant-section-title">Order food</h2>
        <p className="restaurant-section-desc">Menu and ordering coming soon. Browse reels below.</p>
        <button type="button" className="restaurant-order-btn" disabled>Order food (coming soon)</button>
      </section>

      {/* Food Items */}
      <section className="restaurant-section">
        <h2 className="restaurant-section-title">Food Items</h2>
        {reels.length === 0 ? (
          <p className="restaurant-no-reels">No food items available yet.</p>
        ) : (
          <div className="restaurant-food-grid">
            {reels.map((item) => (
              <div key={item._id} className="restaurant-food-card">
                <video
                  src={item.video}
                  className="restaurant-food-video"
                  loop
                  muted
                  playsInline
                  controls
                />
                <div className="restaurant-food-info">
                  <h4>{item.name}</h4>
                  {item.description && <p>{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Restaurant