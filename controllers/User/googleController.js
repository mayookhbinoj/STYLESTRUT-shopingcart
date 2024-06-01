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
const { ObjectId } = require('mongoose').Types;



require("../../auth")
const createToken = (user)=>{
    const JWT_SECRET = process.env.JWT_SECRET
    return jwt.sign(user,JWT_SECRET,{expiresIn:"1h"})
  
  }


const verifyGoogle=async(req,res)=>{
    try {
      console.log("req.user",req.user);
         const userData = await user.findOne({email:req.user.email})
          console.log('existing use',userData);
          if(userData !==null){
              const token = createToken({id:userData._id})
              res.cookie("jwt",token,{httpOnly:true,maxAge:600000000})
          res.redirect('/shop')
            
          }
          else{
          
            
        const users = new user({
          name:req.user.given_name,
          email:req.user.email,
          password:"ffdsdsaf",
          phone:"121212122",
          image:req.user.picture
      })
      const result=await users.save()
      if (result) {
        console.log("id",result._id)
        const saveWallet = await wallet.findOne({ userId: result._id });

        if (!saveWallet) {
          const newWallet = new wallet({ userId: result._id });
          await newWallet.save();
          console.log("new wallet", newWallet);
        }
      }

            
         
              const token = createToken({id:result._id})
              res.cookie("jwt",token,{httpOnly:true,maxAge:600000000})
          res.redirect('/shop',)
  
            }
    } catch (error) {
      console.log("Error in verifygoogle:", error);
      res.status(500).send("Internal Server Error");
      
    }
  }
  module.exports={
    verifyGoogle
  }