import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const UserAccount = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <button 
        className="back-button"
        onClick={() => navigate(-1)}
        title="Go Back"
        style={{ marginBottom: '16px' }}
      >
        ← Back
      </button>
      <h1>User Account</h1>
      <p>Welcome to your account page!</p>
      <Link to="/user/dashboard" style={{ display: 'block', marginTop: '16px', color: 'var(--color-primary)' }}>
        Go to My Dashboard (Saved Reels & Past Orders)
      </Link>
    </div>
  )
}

export default UserAccount