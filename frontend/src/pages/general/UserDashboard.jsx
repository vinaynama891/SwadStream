import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE = 'http://localhost:3000/api'

const UserDashboard = () => {
  const navigate = useNavigate()
  const [savedReels, setSavedReels] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('saved')

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/user/saved-reels`, { withCredentials: true }),
      axios.get(`${API_BASE}/user/orders`, { withCredentials: true })
    ])
      .then(([res1, res2]) => {
        setSavedReels(res1.data.savedReels || [])
        setOrders(res2.data.orders || [])
      })
      .catch((err) => {
        console.error('Error fetching data:', err)
        setSavedReels([])
        setOrders([])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="user-dashboard">
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="user-dashboard">
      <header className="user-dashboard-header">
        <button type="button" className="user-dashboard-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>My Dashboard</h1>
      </header>

      <div className="user-dashboard-tabs">
        <button
          type="button"
          className={`user-dashboard-tab ${activeTab === 'saved' ? 'user-dashboard-tab--active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved Reels
        </button>
        <button
          type="button"
          className={`user-dashboard-tab ${activeTab === 'orders' ? 'user-dashboard-tab--active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Past Orders
        </button>
      </div>

      {activeTab === 'saved' && (
        <section className="user-dashboard-section">
          <h2 className="user-dashboard-section-title">Saved Reels</h2>
          {savedReels.length === 0 ? (
            <p className="user-dashboard-empty">No saved reels yet. Save reels from the feed to see them here.</p>
          ) : (
            <div className="user-dashboard-reels-grid">
              {savedReels.map((reel) => (
                <div key={reel._id} className="user-dashboard-reel-card">
                  <video 
                    src={reel.video} 
                    muted 
                    loop 
                    playsInline 
                    controls
                    className="user-dashboard-reel-video" 
                  />
                  <div className="user-dashboard-reel-info">
                    <p className="user-dashboard-reel-name">{reel.name || 'Untitled'}</p>
                    {reel.description && (
                      <p className="user-dashboard-reel-desc">{reel.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'orders' && (
        <section className="user-dashboard-section">
          <h2 className="user-dashboard-section-title">Past Orders</h2>
          {orders.length === 0 ? (
            <p className="user-dashboard-empty">No orders yet. Your order history will appear here.</p>
          ) : (
            <div className="user-dashboard-orders">
              {orders.map((order) => (
                <div key={order._id} className="user-dashboard-order-card">
                  <div className="user-dashboard-order-header">
                    <h3>Order #{order._id.toString().slice(-6).toUpperCase()}</h3>
                    <span className={`user-dashboard-order-status user-dashboard-order-status--${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  {order.items && order.items.length > 0 && (
                    <div className="user-dashboard-order-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="user-dashboard-order-item">
                          <span>{item.name} x{item.quantity}</span>
                          <span>₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="user-dashboard-order-footer">
                    <p className="user-dashboard-order-total">Total: ₹{order.totalAmount || 0}</p>
                    <p className="user-dashboard-order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default UserDashboard