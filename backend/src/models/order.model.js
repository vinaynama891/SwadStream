const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [{
        name: String,
        quantity: Number,
        price: Number
    }],
    totalAmount: Number,
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'confirmed', 'delivered', 'cancelled']
    }
}, { timestamps: true });

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;