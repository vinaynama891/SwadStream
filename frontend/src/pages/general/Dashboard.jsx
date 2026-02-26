import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import im1 from "../../assets/SwadStream.png";
import im2 from "../../assets/banner.png";

const API_BASE = "http://localhost:3000/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [foodPartners, setFoodPartners] = useState([]);
  const [savedReels, setSavedReels] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [partnerFoods, setPartnerFoods] = useState([]);
  const [showAllRestaurants, setShowAllRestaurants] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE}/auth/food-partner/list`, { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.foodPartners) {
          setFoodPartners(res.data.foodPartners);
        }
      })
      .catch(() => setFoodPartners([]));

    axios
      .get(`${API_BASE}/user/saved-reels`, { withCredentials: true })
      .then((res) => {
        setSavedReels(res.data.savedReels || []);
      })
      .catch(() => setSavedReels([]));
  }, []);

  const handleLogout = () => {
    axios
      .get(`${API_BASE}/auth/user/logout`, { withCredentials: true })
      .then(() => navigate("/user/login"))
      .catch(() => navigate("/user/login"));
  };

  const handleInfoClick = (partner) => {
    setSelectedPartner(partner);
    axios
      .get(`${API_BASE}/food/partner/${partner._id}`, { withCredentials: true })
      .then((res) => {
        setPartnerFoods(res.data.foodItems || []);
      })
      .catch(() => setPartnerFoods([]));
  };

  const categories = [
    { icon: "🍕", label: "Pizza" },
    { icon: "🍔", label: "Burgers" },
    { icon: "🍜", label: "Noodles" },
    { icon: "🍰", label: "Desserts" },
    { icon: "☕", label: "Cafe" },
    { icon: "🍗", label: "Chicken" },
    { icon: "🥗", label: "Healthy" },
    { icon: "🍣", label: "Sushi" },
  ];

  const collections = [
    {
      title: "New in town",
      subtitle: "8 places",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Trending",
      subtitle: "12 places",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Best rated",
      subtitle: "20+ places",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "Pure veg",
      subtitle: "15 places",
      gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    },
  ];

  return (
    <div className="zomato-dashboard">
      <header className="zomato-header">
        <div className="zomato-header-inner">
          
          <div
            className="zomato-logo-wrap"
            onClick={() => navigate("/")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate("/")}
          >
            <img className="zomato-logo-icon" src={im1} alt="SwadStream" />
            <span className="zomato-logo">SwadStream</span>
          </div>
        </div>
      </header>
      <div className="zomato-header-right">
        <button
          type="button"
          className="zomato-logout-btn"
          onClick={handleLogout}
        >
          <i className="fa-solid fa-backward" />
        </button>
      </div>

      <nav className="zomato-tabs">
        <button type="button" className="zomato-tab zomato-tab--active">
          Delivery
        </button>
        <button type="button" className="zomato-tab vinay">
          Dining Out
        </button>
        <button type="button" className="zomato-tab vinay">
          Nightlife
        </button>
      </nav>

      {foodPartners.length > 0 && (
        <section className="zomato-section">
          <h2 className="zomato-section-title">Restaurants on SwadStream</h2>
          <p className="zomato-section-subtitle">Tap to order & watch reels</p>
          <div className="zomato-restaurant-cards">
            {(showAllRestaurants ? foodPartners : foodPartners.slice(0, 2)).map((partner) => (
              <div
                key={partner._id}
                className="zomato-restaurant-card-clickable"
                onClick={() => navigate(`/restaurant/${partner._id}`, { state: { name: partner.name } })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate(`/restaurant/${partner._id}`, { state: { name: partner.name } })
                }
              >
                <div className="zomato-restaurant-card-img">
                  <img 
                    src={im2} 
                    alt={partner.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div 
                  className="zomato-restaurant-card-info"
                  onClick={(e) => { e.stopPropagation(); handleInfoClick(partner); }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleInfoClick(partner)}
                >
                  <h3>{partner.name}</h3>
                  <p>{partner.contactName}</p>
                </div>
              </div>
            ))}
          </div>
          {foodPartners.length > 2 && (
            <div className="view-more-container">
              <button 
                type="button" 
                className="view-more-btn"
                onClick={() => setShowAllRestaurants(!showAllRestaurants)}
              >
                {showAllRestaurants ? 'View Less' : 'View More'}
              </button>
            </div>
          )}
        </section>
      )}

      <div className="zomato-search-wrap">
        <span className="zomato-search-icon">🔍</span>
        <input
          type="text"
          className="zomato-search"
          placeholder="Search for restaurant, cuisine or a dish"
        />
      </div>

      <div className="zomato-reels-cta" onClick={() => navigate("/home")}>
        <div className="zomato-reels-bg" />
        <div className="zomato-reels-content">
          <button type="button" className="zomato-reels-btn">
            <span className="zomato-reels-icon">🎬</span>
            Reels
          </button>
          <p className="zomato-reels-hint">Watch food reels from restaurants</p>
        </div>
      </div>

      {savedReels.length > 0 && (
        <section className="zomato-section">
          <h2 className="zomato-section-title">Saved reels</h2>
          <p className="zomato-section-subtitle">
            Reels you saved to watch later
          </p>
          <div className="saved-reels-grid">
            {savedReels.map((reel) => (
              <div
                key={reel._id}
                className="saved-reel-card"
                onClick={() => navigate("/home")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate("/home")}
              >
                <video
                  src={reel.video}
                  className="saved-reel-video"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <p className="saved-reel-description">
                  {reel.description || "Food reel"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="zomato-offers-strip">
        <span className="zomato-offers-badge">Offers</span>
        <span className="zomato-offers-text">
          50% off on first order • Free delivery above ₹99
        </span>
      </div>

      <section className="zomato-section zomato-section--categories">
        <h2 className="zomato-section-title">Eat what makes you happy</h2>
        <div className="zomato-categories">
          {categories.map((cat, i) => (
            <button key={i} type="button" className="zomato-cat-card">
              <div className="zomato-cat-icon">{cat.icon}</div>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="zomato-section">
        <h2 className="zomato-section-title">Collections</h2>
        <p className="zomato-section-subtitle">
          Explore curated lists of top restaurants
        </p>
        <div className="zomato-collections">
          {collections.map((coll, i) => (
            <div
              key={i}
              className="zomato-coll-card"
              style={{ background: coll.gradient }}
            >
              <span className="zomato-coll-title">{coll.title}</span>
              <span className="zomato-coll-subtitle">{coll.subtitle}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="zomato-section">
        <h2 className="zomato-section-title">Delivery restaurants near you</h2>
        <p className="zomato-section-subtitle">
          Discover the best food in your area
        </p>
        <div className="zomato-restaurant-placeholder">
          <div className="zomato-restaurant-card">
            <div className="zomato-restaurant-img" />
            <div className="zomato-restaurant-info">
              <h3>Restaurant name</h3>
              <p>North Indian • ₹200 for two</p>
              <span className="zomato-restaurant-rating">4.2 • 25 mins</span>
            </div>
          </div>
          <div className="zomato-restaurant-card">
            <div className="zomato-restaurant-img" />
            <div className="zomato-restaurant-info">
              <h3>Restaurant name</h3>
              <p>North Indian • ₹200 for two</p>
              <span className="zomato-restaurant-rating">4.2 • 25 mins</span>
            </div>
          </div>
        </div>
      </section>

      {selectedPartner && (
        <div className="food-modal-overlay" onClick={() => setSelectedPartner(null)}>
          <div className="food-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Food Items from {selectedPartner.name}</h3>
            <div className="food-list">
              {partnerFoods.length === 0 ? (
                <p>No food items available.</p>
              ) : (
                partnerFoods.map((food) => (
                  <div key={food._id} className="food-item">
                    <video
                      src={food.video}
                      className="food-item-video"
                      controls
                      muted
                      playsInline
                    />
                    <h4>{food.name}</h4>
                    {food.description && <p>{food.description}</p>}
                  </div>
                ))
              )}
            </div>
            <button type="button" onClick={() => setSelectedPartner(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Bottom Fixed Navbar */}
      <nav className="bottom-navbar">
        <button
          type="button"
          className="zomato-dashboard-btn bottom-nav-btn"
          onClick={() => navigate("/user/dashboard")}
        >
          <i className="fa-solid fa-circle-user" />
          <span>Profile</span>
        </button>
        <button
          type="button"
          className="reels-btn bottom-nav-btn"
          onClick={() => navigate("/home")}
        >
          <span className="reels-icon">🎬</span>
          <span>Reels</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;