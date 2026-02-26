const foodModel = require("../models/fooditem.model");
const storageService = require('../services/storage.service');
const { v4 : uuid} = require("uuid");

async function createFood(req,res){
    
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());
    const foodItem =    await foodModel.create({
        name:req.body.name,
        description:req.body.description,
        video:fileUploadResult.url,
        foodPartner:req.foodPartner._id
    })
    res.status(201).json({
        message:"Food Created Successfully",
        food:foodItem
    })  


}
async function getFoodItems(req, res) {
    console.log('getFoodItems called');
    const foodItems = await foodModel.find({})
        .populate('likes', 'fullName')
        .populate('dislikes', 'fullName')
        .lean()
    console.log('Found food items:', foodItems.length);
    // Normalize for frontend: likeCount
    const items = foodItems.map(item => ({
        ...item,
        likeCount: item.likes?.length ?? 0,
        dislikeCount: item.dislikes?.length ?? 0
    }))
    res.status(200).json({
        message: 'Food items fetched successfully',
        foodItems: items
    })
}
async function getFoodItemsByPartner(req, res) {
    const { partnerId } = req.params
    const foodItems = await foodModel.find({ foodPartner: partnerId })
        .populate('likes', 'fullName')
        .populate('dislikes', 'fullName')
        .populate('comments.user', 'fullName email')
        .lean()
    res.status(200).json({ message: 'Food items fetched', foodItems })
}

async function likeFoodItem(req, res) {
    const { id } = req.params;
    const userId = req.user._id;

    const foodItem = await foodModel.findById(id);
    if (!foodItem) {
        return res.status(404).json({ message: 'Food item not found' });
    }

    const isLiked = foodItem.likes.includes(userId);
    const isDisliked = foodItem.dislikes.includes(userId);

    if (isLiked) {
        // Remove like
        foodItem.likes.pull(userId);
    } else {
        // Add like
        foodItem.likes.push(userId);
        // Remove dislike if exists
        if (isDisliked) {
            foodItem.dislikes.pull(userId);
        }
    }

    await foodItem.save();

    const updatedItem = await foodModel.findById(id)
        .populate('likes', 'fullName')
        .populate('dislikes', 'fullName')
        .lean();

    res.status(200).json({
        message: 'Like toggled successfully',
        foodItem: {
            ...updatedItem,
            likeCount: updatedItem.likes?.length ?? 0,
            dislikeCount: updatedItem.dislikes?.length ?? 0
        }
    });
}

async function dislikeFoodItem(req, res) {
    const { id } = req.params;
    const userId = req.user._id;

    const foodItem = await foodModel.findById(id);
    if (!foodItem) {
        return res.status(404).json({ message: 'Food item not found' });
    }

    const isLiked = foodItem.likes.includes(userId);
    const isDisliked = foodItem.dislikes.includes(userId);

    if (isDisliked) {
        // Remove dislike
        foodItem.dislikes.pull(userId);
    } else {
        // Add dislike
        foodItem.dislikes.push(userId);
        // Remove like if exists
        if (isLiked) {
            foodItem.likes.pull(userId);
        }
    }

    await foodItem.save();

    const updatedItem = await foodModel.findById(id)
        .populate('likes', 'fullName')
        .populate('dislikes', 'fullName')
        .lean();

    res.status(200).json({
        message: 'Dislike toggled successfully',
        foodItem: {
            ...updatedItem,
            likeCount: updatedItem.likes?.length ?? 0,
            dislikeCount: updatedItem.dislikes?.length ?? 0
        }
    });
}

module.exports = {
    createFood,
    getFoodItems,
    getFoodItemsByPartner
};