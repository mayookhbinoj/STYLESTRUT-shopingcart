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

const jwt=require("jsonwebtoken")
const mongoose=require("mongoose");
const User = require("../../models/userModel");
const { ObjectId } = require('mongoose').Types;



require("../../auth")


const checkOutLoad=async(req,res)=>{
    try {
      console.log("enter in to check load");
      const userId = req.id.id; 
      const id=req.query.id
      console.log(id);
      console.log("userid 2",userId);
      const Adress=await adress.find({user: userId, isDelete: false })
      const cartIt=await cart.find({user: userId})
      const userData=await user.findOne({_id:userId})
      console.log("cartIt",);
      let couponStatus=cartIt[0].coupon
    
     
      const couponData=userData.coupon
     
    
      
  
     
      const cartItems = await cart.aggregate([
        {
            $match: { user:new mongoose.Types.ObjectId(userId)} 
        },
        {
            $unwind: "$products" 
        },
        {
            $lookup: {
                from: "products", 
                localField: "products.productId",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        {
            $unwind: "$productDetails" // Unwind the productDetails array
        },
        {
            $project: {
                _id: 0,
                product: "$productDetails",
                quantity: "$products.quantity",
                size: "$products.size"
            }
        },
        
    ]);
    let subtotal = 0;
  cartItems.forEach(item => {
      subtotal += item.product.price * item.quantity;
  });
  const saveCoupon = await coupon.find({
    minimum: { $lte: subtotal }
   })
  console.log("sub",saveCoupon)

      res.render("checkout",{cartItems:cartItems,Adress:Adress,id:id,applycoupon:saveCoupon,cartIt:cartIt,subtotal:subtotal,couponData:couponData,couponStatus:couponStatus})
    } catch (error) {
      console.error("Error in checkoutLoad function:", error);
      res.status(500).render("error500", { message: "Internal Server Error" })
    }
  }
  const couponApply=async(req,res)=>{
    try {
     
      console.log("coupon load");
     const {couponCode,productId}=req.body
     const userId=req.id.id
     
   
     const user = await User.findById(userId)
     console.log("userrrr",user,);
     if (user.coupon.includes(couponCode)) {
        return res.status(400).json({ success: false, message: 'Coupon already used' });
    }

     const cartItems = await cart.aggregate([
      {
          $match: { user:new mongoose.Types.ObjectId(userId)} 
      },
      {
          $unwind: "$products" 
      },
      {
          $lookup: {
              from: "products", 
              localField: "products.productId",
              foreignField: "_id",
              as: "productDetails"
          }
      },
      {
          $unwind: "$productDetails" 
      },
      {
          $project: {
              _id: 0,
              product: "$productDetails",
              quantity: "$products.quantity",
              size: "$products.size"
          }
      },
      
  ]);
  let subtotal = 0;
cartItems.forEach(item => {
    subtotal += item.product.price * item.quantity;
})
const applycoupon=await coupon.findOne()
const Coupon = await coupon.findOne({ 
    couponCode:couponCode });
    console.log("discouont amount",coupon);


  let minus=subtotal-Coupon.discount_amount
  console.log(minus);
 const updateCart=await cart.findOneAndUpdate(
    { user: userId},{subtotal: minus},{new :true}
 )


   if(updateCart){
   
    const updateCouponStatus = await cart.updateOne(
        { user: userId },
        { coupon: "Applied" },{new:true}
    );
   

    user.coupon.push(couponCode); // Assuming `coupon` is an array field in the user schema
    await user.save()
    res.json({ success: true, message: 'Coupon applied successfully' });
   }else{
    console.log("not deleted");
   }

    } catch (error) {
        console.log('Error to apply the coupon', error);
        res.status(500).render("error500").send('Internal Server Error');
    }
  }


  const removeCoupon=async(req,res)=>{
    try {
        console.log("enter in to remove coupon ");
        const userId=req.id.id
        const cartItems = await cart.aggregate([
            {
                $match: { user:new mongoose.Types.ObjectId(userId)} 
            },
            {
                $unwind: "$products" 
            },
            {
                $lookup: {
                    from: "products", 
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails" // Unwind the productDetails array
            },
            {
                $project: {
                    _id: 0,
                    product: "$productDetails",
                    quantity: "$products.quantity",
                    size: "$products.size"
                }
            },
            
        ]);
        let subtotal = 0;
      cartItems.forEach(item => {
          subtotal += item.product.price * item.quantity;
      });
      console.log(subtotal,"subtotal");
      const updateCart=await cart.findOneAndUpdate(
        { user: userId},{subtotal: subtotal},{new :true}
     )
     if (updateCart) {
        const updateCouponStatus = await cart.updateOne(
            { user: userId },
            { coupon: "Not Applied" },{new:true}
        )
       
        res.json({ success: true, message: 'Coupon applied successfully' });
     }
     console.log(updateCart,);

    } catch (error) {
        console.log('Error to remove the coupon:', error);
        res.status(500).render("error500").send('Internal Server Error');
    }
  }
  
  module.exports={
    checkOutLoad,
    couponApply,
    removeCoupon    
  }