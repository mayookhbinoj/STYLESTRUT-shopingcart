const mongoose=require("mongoose")
const cart=new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
          ref:"users"
    },
    products:[{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        quantity: {
            type: Number,
            required:true
        },
        size:{
            type:String,
            required:true
        },
       
    }],
    subtotal: {
        type: Number,
        default: 0
    },
    isButton: {
        type: Boolean,
        default: false
      },
      coupon: {
        type: String,
        default: "Not Applied" 
    },
    couponId:{
        type:String
    },
    status:{
        type:String
    }
})
const Cart = mongoose.model("Cart", cart);

module.exports = Cart;