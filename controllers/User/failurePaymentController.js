const user = require("../../models/userModel");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
require("dotenv").config();
const bcrypt=require("bcrypt")
const speakeasy=require("speakeasy")
const otp=require("../../models/otpModel")
const Product=require("../../models/productModel")
const adress=require("../../models/addressModel")
const cart=require("../../models/cartModel")
const Order=require("../../models/orderModel")
const coupon=require("../../models/couponModel")

const retryFailedOrder=async(req,res)=>{
    try {
     console.log("enter in to retry failed order"); 
       const id= req.query.id
       const o=await Order.findOne({_id:id})
       for (const cartItem of o.cartItems) {

        console.log("cart itennnnnn",cartItem)
        const newItem = new cart({
            user: o.userId, 
            products: [{
                productId: cartItem.product._id,
                quantity: cartItem.quantity,
                size: cartItem.size
            }],
          
            subtotal: cartItem.product.price * cartItem.quantity,
            status: "Pending"
        })
       const saveCart= await newItem.save();
       if(saveCart){
        console.log("enter in to log sess");
        const deleteOrder=await Order.findByIdAndDelete(id)
        res.json({sucess:true})
       }
    }
       
     


    } catch (error) {
      console.log(error);  
    }
}





module.exports={
retryFailedOrder
}