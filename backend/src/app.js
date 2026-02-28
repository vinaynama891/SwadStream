const express = require('express');
const cookieParser = require('cookie-parser') 
const authRoutes = require('./routes/auth.routes')
const foodRoutes = require('./routes/food.routes')
const cors = require('cors')
const userRoutes = require('./routes/user.routes');





const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));


app.get("/",(req,res)=>{
    res.send("hi");
})
app.use('/api/auth',authRoutes)
app.use('/api/food',foodRoutes)
app.use('/api/user', userRoutes);

module.exports = app;