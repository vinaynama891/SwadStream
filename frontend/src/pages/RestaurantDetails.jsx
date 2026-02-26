import React from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import FoodCard from '../components/FoodCard'

const RestaurantDetails = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const restaurantName = location.state?.name || 'Restaurant'

  // Dummy food items data
  const foodItems = [
    { id: 1, name: 'Paneer Butter Masala', price: 199, image: 'https://imgs.search.brave.com/X697OGDtw0CqXaDLl-aOC21mJbGx9Q2H8LMyTVqboKU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAyLzI4LzI4LzIy/LzM2MF9GXzIyODI4/MjI1N19DbXdDRzhH/eHQwbU95cFFKOVVk/ZmxuWGJhNUpKdGgy/di5qcGc' },
    { id: 2, name: 'Dal Tadka', price: 149, image: 'https://imgs.search.brave.com/oTYMNKM9xB_aV1-3__UAaAAI5m7j6H8CGNq_V-pvwSc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjQv/MzM0Lzk0Ni9zbWFs/bC9kYWwtbGVudGls/LWZyeS10YWRrYS13/aXRoLWRyeS1jaGls/bGktaW4tY29wcGVy/LXBvdC1vbi13aGl0/ZS1iYWNrZ3JvdW5k/LXBob3RvLkpQRw' },
    { id: 3, name: 'Veg Biryani', price: 179, image: 'https://imgs.search.brave.com/1OiKMsNWuZ7-2hWQ_z8oF_A-_hQzKpeP_018KDSDsZ0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM2/MzMwNjg2My9waG90/by92ZWctYmlyeWFu/aS1vbi1ibGFjay1i/YWNrZ3JvdW5kLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1f/RnZuVWdEZ2hvUXdM/MXdUTEFERUdoaTlw/TVgtSFpWTFRMMmtN/T2FzQ0FBPQ' },
    { id: 4, name: 'Butter Roti', price: 29, image: 'https://imgs.search.brave.com/cQxAB1OHAfHB4AeKqCoODF1QszuJHFo-dzRm25ZgFUQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNjUv/NDA4LzI3NS9zbWFs/bC9mbHVmZnktdGFu/ZG9vcmktcm90aS13/aXRoLWZyZXNoLWJ1/dHRlci1zZXJ2ZWQt/b24tdGhlLXNpZGUt/cGhvdG8uanBn' },
    { id: 5, name: 'Lassi', price: 59, image: 'https://imgs.search.brave.com/XNeEsdpQzC3Xyax6LkU5XyH7OVyh96qvyF6029GPgXg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9pbWFnZS1w/aG90by9pbWFnZS1p/bmRpYW4tc29mdC1k/cmluay1sYXNzaS0y/NjBudy0xMTQzNDc4/Njk0LmpwZw' },
    { id: 6, name: 'Gulab Jamun', price: 89, image: 'https://imgs.search.brave.com/UdbWY_yaAdpLYp6VaV-T2x3TZXSzg2HqHYzrgos9PiA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzE2LzQ1LzI3LzQy/LzM2MF9GXzE2NDUy/NzQyNzFfa3ZOYnRz/MWE2N2szZDBKd0Ny/bjFSSmd3dTVwY3hY/UXMuanBn' },
  ]

  return (
    <div className="restaurant-details">
      

      <div className="restaurant-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="restaurant-name">{restaurantName}</h1>
        <p className="restaurant-subtitle">Delicious food & reels experience</p>
      </div>

      <div className="restaurant-content">
        <h2 className="section-title">Popular Items</h2>
        <div className="food-grid">
          {foodItems.map((item) => (
            <FoodCard
              key={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetails