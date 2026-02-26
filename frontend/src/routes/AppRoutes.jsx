import React, {useState} from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import UserRegister from '../pages/UserRegister'
import UserLogin from '../pages/UserLogin'
import FoodPartnerRegister from '../pages/FoodPartnerRegister'
import FoodPartnerLogin from '../pages/FoodPartnerLogin'
import Home from '../pages/general/Home'
import Create from '../pages/food-partner/CreateFoodPartner'
import UserAccount from '../pages/UserAccount'
import Dashboard from '../pages/general/Dashboard'
import Restaurant from '../pages/general/Restaurant'
import RestaurantDetails from '../pages/RestaurantDetails'
import Profile from '../pages/food-partner/Profile'
import UserDashboard from '../pages/general/UserDashboard'
import StoreView from '../pages/general/StoreView';

const AppRoutes = () => {
  const [mainToken, setMainToken] = useState(null);
  return (
    <Router>
      <Routes>
        <Route path="/user/register" element={<UserRegister/>} />
        <Route path="/user/login" element={<UserLogin setMainToken={setMainToken} />}  />
        <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
        <Route path="/" element={<UserLogin setMainToken={setMainToken} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-food" element={<Create />} />
        <Route path="/user/account" element={<UserAccount />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/profile/:id?" element={<Profile />} />
        <Route path="/store/:id" element={<StoreView />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/restaurant/:id" element={<Restaurant />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
