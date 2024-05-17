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


const securePasword=async(password)=>{
try {
  const passwordMatch=await bcrypt.hash(password,10)
    return passwordMatch
  }
 catch (error) {
  console.log(error.message);
  
}
}

const loadRegister = async (req, res) => {
  try {
    const errorMessage = req.session.errorMessage || '';
    req.session.errorMessage = ''; 
    res.render("register", { errorMessage });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};


const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const insertUser = async (req, res) => { 
   try {
      const {ReferalCode}=req.body
      const findReferal=await user.findOne({referralCode:ReferalCode})
      console.log(findReferal,"find");
      
    
      const spassword=await securePasword(req.body.password)
      const existingUser = await user.findOne({ email: req.body.email });
      if (!req.body.name) {
        return res.render('register', { message: 'Name field cannot be empty. Please enter your name.' });
    }
      if (existingUser) {
        return res.render('register', { message: 'Email already exists. Please use a different email.' });
    }
    if (!validatePassword(req.body.password)) {
      return res.render('register', { message: 'Password must contain at least one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long.' });
  }
  function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const randomString = generateRandomString(10);


  
      const users = new user( {
          name:req.body.name,
          email:req.body.email,
          phone:req.body.phone,
          password:spassword ,
          referralCode:randomString
      })
    const result=await users.save()
   
    
      if(result){
        const token = createToken({id:result._id})
        console.log(result._id,"resss");
      
        res.cookie("jwt",token,{httpOnly:true,maxAge:60*60*1000}) 
      
    
      if(findReferal){
        
        const saveWallet=new wallet({
          totalAmount:500,
          userId:result._id
         
        })
        await saveWallet.save()
        
        return  res.render("sentotp",{tessage:"Congratulation 500 Amount has been credited your Wallet",userId:result._id})
      
      }
      const saveWallet=new wallet({
        userId:result._id
       
      })
      await saveWallet.save()
        res.render("sentotp",{message:"Your registration has been sucessfull",userId:result._id})
    }
    else{
        res.redirect("/register",{message:"Your registration has been failed"})
    }
  
  }
 
catch (error) {
  console.log(error);
  const errorMessage = "Internal Server Error";
  return res.status(500).render("error500", { statusCode: 500, errorMessage });
 
}
  
}



module.exports = {

  loadRegister,
  insertUser,

};
