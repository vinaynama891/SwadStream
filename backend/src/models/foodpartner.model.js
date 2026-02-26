const mongoose = require('mongoose');
const foodPartnerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    contactName:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        unique:true,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePhoto:{
        type:String,
        default:null
    }
})
const foodPartnerModel = mongoose.model("foodpartner",foodPartnerSchema);

module.exports = foodPartnerModel;