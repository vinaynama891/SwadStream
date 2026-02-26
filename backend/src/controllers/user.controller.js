const userModel = require('../models/user.model');
const foodModel = require('../models/fooditem.model');
const orderModel = require('../models/order.model');

async function saveReel(req, res) {
    try {
        const { reelId } = req.params;
        const userId = req.user._id;

        const user = await userModel.findByIdAndUpdate(
            userId,
            { $addToSet: { savedReels: reelId } },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'Reel saved', savedReels: user.savedReels });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function unsaveReel(req, res) {
    try {
        const { reelId } = req.params;
        const userId = req.user._id;

        const user = await userModel.findByIdAndUpdate(
            userId,
            { $pull: { savedReels: reelId } },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'Reel removed', savedReels: user.savedReels });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


async function likeReel(req, res) {
    try {
        console.log("Hello")
        const { reelId } = req.params;
        const userId = req.user._id;
        console.log("Body", req.params)

        // Update user's liked reels
        const user = await userModel.findByIdAndUpdate(
            userId,
            { $addToSet: { likedReels: reelId } },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update food item's likes count
        await foodModel.findByIdAndUpdate(reelId, {
            $addToSet: { likes: userId }
        });

        const foodItem = await foodModel.findById(reelId).select('likes').lean();
        res.status(200).json({ 
            message: 'Reel liked', 
            likedReels: user.likedReels,
            likeCount: foodItem.likes.length
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function unlikeReel(req, res) {
    try {
        const { reelId } = req.params;
        const userId = req.user._id;

        const user = await userModel.findByIdAndUpdate(
            userId,
            { $pull: { likedReels: reelId } },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update food item's likes count
        await foodModel.findByIdAndUpdate(reelId, {
            $pull: { likes: userId }
        });

        const foodItem = await foodModel.findById(reelId).select('likes').lean();
        res.status(200).json({ 
            message: 'Reel unliked', 
            likedReels: user.likedReels,
            likeCount: foodItem.likes.length
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
async function addComment(req, res) {
    try {
        const { reelId } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        if (!text || text.trim() === '') {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const foodItem = await foodModel.findByIdAndUpdate(
            reelId,
            {
                $push: {
                    comments: {
                        user: userId,
                        text: text.trim(),
                        createdAt: new Date()
                    }
                }
            },
            { new: true }
        ).populate('comments.user', 'fullName email').lean();

        if (!foodItem) return res.status(404).json({ message: 'Reel not found' });

        res.status(200).json({
            message: 'Comment added',
            comments: foodItem.comments
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getComments(req, res) {
    try {
        const { reelId } = req.params;
        const foodItem = await foodModel.findById(reelId)
            .populate('comments.user', 'fullName email')
            .select('comments')
            .lean();

        if (!foodItem) return res.status(404).json({ message: 'Reel not found' });

        res.status(200).json({ comments: foodItem.comments || [] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
async function getSavedReels(req, res) {
    try {
        const user = await userModel.findById(req.user._id).populate('savedReels').lean();
        if (!user) return res.status(404).json({ message: 'User not found' });
        const reels = user.savedReels || [];
        res.status(200).json({ savedReels: reels });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getLikedReels(req, res) {
    try {
        const user = await userModel.findById(req.user._id).populate('likedReels').lean();
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ likedReels: user.likedReels || [] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getPastOrders(req, res) {
    try {
        const orders = await orderModel.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
async function getSavedAndLikedIds(req, res) {
    try {
        const user = await userModel.findById(req.user._id).select('savedReels likedReels').lean();
        if (!user) return res.status(404).json({ message: 'User not found' });
        const savedIds = (user.savedReels || []).map(id => id.toString ? id.toString() : String(id));
        const likedIds = (user.likedReels || []).map(id => id.toString ? id.toString() : String(id));
        res.status(200).json({ savedIds, likedIds });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
async function deleteComment(req, res) {
    try {
        const { reelId, commentId } = req.params;
        const userId = req.user._id;

        const foodItem = await foodModel.findOneAndUpdate(
            {
                _id: reelId,
                'comments._id': commentId,
                'comments.user': userId, // ensure only owner can delete
            },
            {
                $pull: { comments: { _id: commentId, user: userId } },
            },
            {
                new: true,
            }
        )
            .populate('comments.user', 'fullName email')
            .select('comments')
            .lean();

        if (!foodItem) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        return res.status(200).json({ comments: foodItem.comments || [] });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    saveReel,
    unsaveReel,
    likeReel,
    unlikeReel,
    addComment,
    getComments,
    getSavedReels,
    getLikedReels,
    getPastOrders,
    getSavedAndLikedIds,
    deleteComment
};