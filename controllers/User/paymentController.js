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
const wallet=require("../../models/walletModel")

const jwt=require("jsonwebtoken")
const mongoose=require("mongoose");
const User = require("../../models/userModel");
const Razorpay = require('razorpay');
const {RazoPay_Id_Key,RazoPay_secret_Key}=process.env

const razopayInstance=new Razorpay({
    key_id:RazoPay_Id_Key,
    key_secret:RazoPay_secret_Key
  
  })

const payment=async(req,res)=>{
    
    try {
      console.log("enter in to payment page");
      const userId=req.id.id
      const saveWallet=await wallet.findOne({userId:userId})
    
      const findCart=await cart.findOne({user:userId})
      console.log("findcart",findCart.subtotal);
      res.render("payment",{findCart:findCart,saveWallet:saveWallet})
    } catch (error) {
      console.error("Error in payment function:", error);
      res.status(500).render("error", { message: "Internal Server Error" });
    }
  }

  //online
const payOnline = async(req, res) => {
    try {
      const userid=req.id.id
      const cartIt=await cart.find({user: userid})
      let total=cartIt[0].subtotal
    
      const cartItems = await cart.aggregate([
        {
            $match: { user:new mongoose.Types.ObjectId(userid)} 
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
   
        console.log("enter into pay online");
        const idFromBody = req.body.id; 
        const idFromQuery = req.query.id
        console.log(idFromBody,idFromQuery);
        const amount = total*100
        console.log(amount);
        const options = {
            amount: amount, // Adjust the amount as needed
            currency: 'INR',
            receipt: 'razorUser@gmail.com'
        }
  
        razopayInstance.orders.create(options, (err, order) => {
            if (!err) {
                res.status(200).send({
                    success: true,
                    msg: 'Order Created',
                    order_id: order.id,
                    amount: amount,
                    key_id: RazoPay_Id_Key,
                    product_name: req.body.name,
                    description: req.body.description,
                    contact: "8567345632",
                    name: "Sandeep Sharma",
                    email: "sandeep@gmail.com"
                });
            } else {
                res.status(400).send({
                    success: false,
                    msg: 'Something went wrong!'
                });
            }
        });
  
    } catch (error) {
        console.log(error.message);
    }
  }
  const saveFailOrder=async(req,res)=>{
    try {
    
        console.log("eneter in to save failure ");
        const userid=req.id.id
        const cartItems = await cart.aggregate([
            {
                $match: { user:new mongoose.Types.ObjectId(userid)} 
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
        const {id}=req.body
        console.log(id)
        const cartIt=await cart.find({user: userid})
        let total=cartIt[0].subtotal
        const orderCreate=new Order({
            userId:userid,
            addressId:id,
            paymentMethod:"online",
            cartItems:cartItems,
            total:total,
            status:"payment failed"
            
            
            
          })
          const saveOrder=await orderCreate.save()
          console.log("Save order",saveOrder)
          const deletedCart = await cart.findOneAndDelete({ user: userid });
          res.json({sucess:true})
       
    } catch (error) {
        console.error("something went wrong to place the order payment has been failed", error);
        res.status(500).render("error", { message: "Internal Server Error" });
        
    }
  }
  module.exports={
    payment,
    payOnline,
    saveFailOrder
  }