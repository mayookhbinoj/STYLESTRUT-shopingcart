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
const { ObjectId } = require('mongoose').Types;



require("../../auth")

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


const searchProduct = async (req, res) => {
    try {
      const userId = req.id.id;
      const user = await User.findOne({ _id: userId });
      console.log("User:", user);
      const id=req.query.id
      const size = req.query.size;
      const product=await Product.find({isListed:false})
      console.log("product",product);
      const Category =await category.find()
      const inputLetter = req.body.search
  
      
      
  let sortOption = {}
  
     
        if(inputLetter){
          const escapedInput = escapeRegex(inputLetter);
          const regex = new RegExp(`^${escapedInput}`, "i");
          sortOption.name =  {$regex :regex}
         
      console.log("Regex:", regex);
  
        }
        if(id){
          sortOption.category=id
        }
        if(size){
          sortOption.sizes={
            "$elemMatch": {
              "size": size
            }
          }
        }
        console.log("sort",sortOption);
  let a =req.body.sortOption || req.body.a
  console.log(req.body);
      let products;
      const limit = 6; 
      const page = parseInt(req.body.page) || 1; 
      const skip = (page - 1) * limit; 
  console.log(limit,page,skip);
      if (a === "option") {
        console.log("Sorting by option");
        products = await Product.find(sortOption).skip(skip).limit(limit);
      } else if (a === "lowtohigh") {
        console.log("Sorting low to high");
        products = await Product.find( sortOption )
          .sort({ price: 1 })
          .skip(skip)
          .limit(limit);
      } else if (a === "hightolow") {
        console.log("Sorting high to low");
        products = await Product.find(sortOption )
          .sort({ price: -1 })
          .skip(skip)
          .limit(limit);
      } else if (a === "alphabeticallyAZ") {
        console.log("Sorting alphabetically A-Z");
        products = await Product.find( sortOption )
          .sort({ name: 1 })
          .skip(skip)
          .limit(limit);
      } else if (a === "alphabeticallyZA") {
        console.log("Sorting alphabetically Z-A");
        products = await Product.find( sortOption )
          .sort({ name: -1 })
          .skip(skip)
          .limit(limit);
      } else {
        console.log("Sorting by new arrivals");
        products = await Product.find( sortOption )
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
      }
  
      const totalProducts = await Product.countDocuments( sortOption );
      const totalPages = Math.ceil(totalProducts / limit);
  
      //console.log("Products:", products);
      res.render("home", { inputLetter: inputLetter, product: products, user: userId, currentPage: page, totalPages: totalPages ,a, Category});
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "An error occurred while searching for products." });
    }
  }
  module.exports={
    searchProduct
  }