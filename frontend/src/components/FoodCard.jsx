import React from 'react'

const FoodCard = ({ name, price, image }) => {
  return (
    <div className="food-card">
      <div className="food-image">
        <img src={image || '/placeholder-food.jpg'} alt={name} />
      </div>
      <div className="food-info">
        <h3 className="food-name">{name}</h3>
        <p className="food-price">₹{price}</p>
        <button className="food-add-btn">Add</button>
      </div>
    </div>
  )
}

export default FoodCard