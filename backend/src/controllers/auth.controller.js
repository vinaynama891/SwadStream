const userModel = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuid} = require("uuid");
const foodPartnerModel = require("../models/foodpartner.model")
const storageService = require('../services/storage.service');

async function registerUser(req,res) {
    const {fullName,email,password} = req.body;
    const isUserAlreadyExist = await userModel.findOne({
        email
    })
    if(isUserAlreadyExist){
        return res.status(400).json({
            message:"User Already Exist"
        })
    }

    const hashedPassword = await bcrypt.hash(password,10)
    const user = await userModel.create({
        fullName,
        email,
        password:hashedPassword
    })

    const token = jwt.sign({
        id:user._id,    
    },process.env.JWT_SECRET)
    res.cookie("token" , token)
    res.status(201).json({
        message:"User Registered Successfully",
        user:{
            _id:user._id,
            email:user.email,
            fullName:user.fullName
        }
    })
}

async function loginUser(req,res){
    console.log("Entered in login:", req.body)
    const {email,password} = req.body;
    const user = await userModel.findOne({email: email})
    if(!user){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }
    const token = jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET)

    res.cookie("token",token)

    return res.status(200).json({
        message:"User logged in Successfully",
        user:{
            _id:user._id,
            email:user.email,
            fullName:user.fullName
        },
        token: token
    })
}

function logoutUser(req,res){
    res.clearCookie("token", { path: "/" });
    res.status(200).json({
        message:"User logged out successfully"
    })
}

async function getUserMe(req, res) {
    res.status(200).json({
        user: {
            _id: req.user._id,
            email: req.user.email,
            fullName: req.user.fullName
        }
    });
}


async function registerFoodPartner(req,res){
    try {
        const {name,email,password,phone,contactName,address} = req.body;
        
        // Validate required fields
        if(!name || !email || !password || !phone || !contactName || !address){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        // Check if email already exists
        const isAccountAlreadyExists = await foodPartnerModel.findOne({
            email
        })
        if(isAccountAlreadyExists){
            return res.status(400).json({
                message:"Food Partner Account Already Exists"
            })
        }

        // Check if phone already exists
        const isPhoneExists = await foodPartnerModel.findOne({
            phone: parseInt(phone)
        })
        if(isPhoneExists){
            return res.status(400).json({
                message:"Phone number already registered"
            })
        }
        
        let profilePhotoUrl = null;
        
        // Upload profile photo if provided
        if(req.file){
            try {
                const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());
                profilePhotoUrl = fileUploadResult.url;
            } catch (err) {
                console.error('Image upload error:', err);
                return res.status(500).json({
                    message:"Failed to upload profile photo: " + err.message
                })
            }
        } else {
            return res.status(400).json({
                message:"Profile photo is required"
            })
        }
        
        const hashedPassword = await bcrypt.hash(password,10);
        
        const foodPartner = await foodPartnerModel.create({
            name,
            email,
            password:hashedPassword,
            phone: parseInt(phone),
            address,
            contactName,
            profilePhoto: profilePhotoUrl
        })

        const token = jwt.sign({
            id: foodPartner._id,
        },process.env.JWT_SECRET)

        res.cookie("token",token)

        res.status(201).json({
            message:"Food Partner Registered Successfully",
            foodPartner:{
                _id:foodPartner._id,
                email:foodPartner.email,
                name:foodPartner.name,
                address:foodPartner.address,
                contactName:foodPartner.contactName,
                phone:foodPartner.phone,
                profilePhoto:foodPartner.profilePhoto
            }
        })
    } catch (err) {
        console.error('Registration error:', err);
        
        // Handle mongoose validation errors
        if(err.name === 'ValidationError'){
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                message: errors.join(', ')
            })
        }
        
        // Handle duplicate key error (unique constraint)
        if(err.code === 11000){
            const field = Object.keys(err.keyPattern)[0];
            return res.status(400).json({
                message: `${field} already exists`
            })
        }
        
        // Generic error
        res.status(500).json({
            message:"Registration failed: " + err.message
        })
    }
}

async function loginFoodPartner(req,res) {
    const {email,password} = req.body;
    const foodPartner = await foodPartnerModel.findOne({
        email
    })
    if(!foodPartner){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }
    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const token = jwt.sign({
        id:foodPartner._id,
    },process.env.JWT_SECRET)

    res.cookie("token",token)

    res.status(200).json({
        message:"Food Partner Logged in Successfully",
        foodPartner:{
            _id:foodPartner._id,
            email:foodPartner.email,
            name:foodPartner.name
        }
    })
}

function logoutFoodPartner(req,res){
    res.clearCookie("token", { path: "/" });
    res.status(200).json({
        message:"Food Partner Logged Out Succcessfully"
    });
}

async function getFoodPartnersList(req, res) {
    try {
        const partners = await foodPartnerModel.find({})
             .select('name contactName _id')
            .lean()
        res.status(200).json({
            foodPartners: partners
        })
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch food partners' })
    }
}

async function getFoodPartnerById(req, res) {
    try {
        const { id } = req.params
        console.log('Fetching food partner with id:', id);
        const partner = await foodPartnerModel.findOne({_id: id})
    .select('name contactName address phone email profilePhoto')  // add profilePhoto
    .lean()
        if (!partner) return res.status(404).json({ message: 'Restaurant not found' })
        res.status(200).json(partner)
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch restaurant' })
    }
}
async function getFoodPartnerMe(req, res) {
    try {
        const partner = await foodPartnerModel.findById(req.foodPartner._id)
            .select('_id name email contactName address profilePhoto')
            .lean();
        if (!partner) return res.status(404).json({ message: 'Partner not found' });
        res.status(200).json({ foodPartner: partner });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch partner' });
    }
}



module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserMe,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner,
    getFoodPartnersList,
    getFoodPartnerById,
    getFoodPartnerMe   
};