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
const category = require("../../models/categoryModel");
const loadHome = async (req, res) => {
  
    try {
    
     console.log("enter in to loadhome");
  
      const product=await Product.find({isListed:false})
      const User=await user.findOne({_id:req.id.id})
      const Category=await category.find()
      console.log("userrrr",User);
    
      
    
      const inputLetter = null
      const page = parseInt(req.query.page) || 1; 
          const limit = 8
          const skip = (page - 1) * limit;
          
          const productData = await Product.find().skip(skip).limit(limit);
          const totalProducts = await Product.countDocuments();
          const totalPages = Math.ceil(totalProducts / limit);
     
      res.render("home",{product:productData,user:User,inputLetter:inputLetter, currentPage: page, // Pass current page number to the view
      totalPages: totalPages,Category:Category});
    
    } catch (error) {
      console.error("Error in loadHome:", error);
      res.status(500).send("Internal server error")
    }
  };
  const singleproductLoad=async(req,res)=>{
    try {
     console.log("enter  in to single product");
     const id= req.query.id 
     const productData= await Product.findOne({_id:id})
     console.log(productData);
     const similarproduct=await Product.find({category:productData.category})
     console.log(productData.sizes);
   
     if(productData ){
      res.render("productDetail", { product: productData ,similarproduct:similarproduct});
     }
     
    } catch (error) { 
      console.log("Error in singleproductLoad:", error);
      res.status(500).render("error500", { message: "Internal Server Error" });
      
    }
  }
  module.exports={
    loadHome,
    singleproductLoad,
  }