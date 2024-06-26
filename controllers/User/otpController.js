

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

  const otpCheck = async (req, res) => {
    try {
      const enteredOtp = req.body.otp; 
     const otpEntry = await otp.findOne({ otp: enteredOtp });
     console.log("fdasfasf"+otpEntry);
     if(req.body.otp===""){
      res.json({ validataion: true, validation: 'OTP is not verified or has expired' });
     }
     if (otpEntry !== null && Date.now() - otpEntry.created_at.getTime() <= 60000) {
    
      res.json({ otpverified: true, message: 'OTP is verified' });
  } else {
      res.json({ otpverified: false, message: 'OTP is not verified or has expired' });
  }
      
    } catch (error) {
      console.error("Error in otpCheck: ", error);
      res.status(500).json({ message: 'Internal server error' });
    }
    
  
  }

  const getOtp= async (req,res)=>{

    console.log(req.query.id);
    try {
      const userId=req.query.id
      const saveData=await user.findOne({_id:userId})
      const otpcode = Math.floor(1000 + Math.random() * 9000).toString();
      console.log(otpcode+" code")
      const newOtp = new otp({
        otp: otpcode,
        userId:userId
      });
      const savedOtp = await newOtp.save();
          console.log("OTP saved successfully:", savedOtp); 
  
      const transporter = nodemailer.createTransport({
          service:"gmail",
          host : "smtp.gmail.com",
          port: 587,
          secure: false, 
          auth: {
            user: process.env.user_name,
            pass: process.env.user_password,
          },
        });
        
          const mailOptions = {
            from: {
              name: 'Me',
              address:process.env.user_name
            }, // sender address
            to: saveData.email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: `Welcome to STYLESTRUT Please verify your email with This Otp${otpcode}`, // plain text body
            html: `Welcome to STYLESTRUT Please verify your email with This Otp${otpcode}`, // html body
            
          };
      
          const sendMail = async() => {
              try{
              
                  await transporter.sendMail(mailOptions)
                 
                  console.log("Email sent");
                  
                  res.render('verifyotp',{otpId:savedOtp._id})
                
              }catch(error)
              {
                  console.log(error.message);
              }
          }
      
          sendMail(transporter,mailOptions)
  
      
  
  }catch (error) {
      console.log(error);
      const errorMessage = "Internal Server Error";
      return res.status(500).render("error500", { statusCode: 500, errorMessage })
  }
  }
  const getOTPTime=async(req,res)=>{
    try {
      const id = req.query.id;
     
      const data = await otp.findOne(
        { userId: id },
        { created_at: 1, _id: 0 }
      )
      res.json({ data: data.created_at });
  
    } catch (error) {
      console.error("Error in getOTPTime: ", error);
      res.status(500).json({ message: 'Internal server error' });
  
    }
  }

  module.exports={
    getOtp,
    otpCheck,
    getOTPTime
  }
