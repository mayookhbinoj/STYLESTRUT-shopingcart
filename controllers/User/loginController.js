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
const createToken = (user)=>{
  const JWT_SECRET = process.env.JWT_SECRET
  return jwt.sign(user,JWT_SECRET,{expiresIn:"1h"})

}


const loadLandingPage=async(req,res)=>{
    try {
      console.log("enter in to loadhome");
      const dataProduct=await Product.find().limit(8)
      console.log("data",dataProduct)
      res.render("index",{data:dataProduct})
    } catch (error) {
      console.error("Error in loadLandingPage:", error);
      res.status(500).render("error500")
    }
  }
  const userLoadLogin = async (req, res) => {
    try {
      res.render("userlogin");
    } catch (error) {
    
      console.error("Error in userLoadLogin: ", error);
      res.status(500).send("Internal server error");
    }
  };  
  const verifyLogin=async(req,res)=>{
    try{
      const email=req.body.email
      const password=req.body.password
       const userData= await user.findOne({email:email})
      console.log(req.body);
       
         
       if(userData.blocked){
        console.log("blocked")
        res.render("/loginload",{message:"your account has been blocked "})
       
       }
       console.log(userData);
       if(userData){
        console.log(userData);
        const passwordMatch=await bcrypt.compare(password,userData.password)
        if(passwordMatch){
          const us= req.session.user_id=userData._id
          console.log("login session"+us);
          const token = createToken({id:userData._id})
          console.log(token);
          res.cookie("jwt",token,{httpOnly:true,maxAge:600000000}) 
          res.redirect("/shop")
        }
        else{
          console.log("error ");
          res.render("userlogin",{message:"email  and password is incorrect"})  
        }
       }
       else{
        res.render("userlogin",{message:"email  and password is incorrect"})  
    
       }
      
    }
    
      catch (error) {
        console.error("Error in loadLandingPage:", error);
        res.status(500).render("loginError")
      }
     
    }
    const userlogout=async(req,res)=>{
        try {
          req.session.destroy()
          res.clearCookie("jwt")
          res.redirect("/")
        } catch (error) {
          console.error("Error in Userlogout: ", error);
          res.status(500).send("Internal server error");
        }
      }
      const erroLogin=async(req,res)=>{
        try {
          res.render("loginError")
        } catch (error) {
          console.log(error)
          
        }
      }

      module.exports={
        loadLandingPage,
        userLoadLogin,
        verifyLogin,
        userlogout,
        erroLogin
      }