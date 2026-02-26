const mongoose = require('mongoose');
const foodSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    video:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    foodPartner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"foodpartner",
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
})

const foodModel = mongoose.model("food",foodSchema);
module.exports = foodModel;