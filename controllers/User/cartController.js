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
const wishlist = require("../../models/Wishlist");
const { response } = require("express");
const loadCart = async (req, res) => {
    try {
      
        const userId = req.id.id; 
        console.log("userid 2",userId);
        // const products= await Product.findOne({_id:id})
        // console.log(products);
        const cartItems = await cart.aggregate([
          
            {
                $match: { user: new mongoose.Types.ObjectId(userId) } 
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
                    subtotal:1,
                    product: "$productDetails",
                    quantity: "$products.quantity",
                    size: "$products.size"
                    
                }
            },
            {
                $addFields: {
                    stockQuantity: {
                        $reduce: {
                            input: "$product.sizes",
                            initialValue: 0,
                            in: {
                                $cond: [
                                    { $eq: ["$$this.size", "$size"] },
                                    "$$this.quantity",
                                    "$$value"
                                ]
                            }
                        }
                    }
                }
            }
        
        
          
      ]);
      
           
        
  
  
          res.render("cart",{cartItems:cartItems})
     
    } catch (error) {
      console.log('Error loading the cart', error);
      res.status(500).render("error500").send('Internal Server Error');
    }
  };
  const addCart = async (req, res) => {
    try {
      console.log("enter in to addCart");
      const { productId, size, quantity } = req.query;
      const userId = req.id.id;
      
   
      if (!productId || !size || !quantity || isNaN(quantity)) {
        return res.status(400).json({ success: false, message: 'Invalid input data' });
      }
      
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
  
      const parsedQuantity = parseInt(quantity);
      const subtotal = product.price * parsedQuantity;
  
      let userCart = await cart.findOne({ user: userId });
      if (!userCart) {
        userCart = new cart({
          user: userId,
          products: [],
          subtotal: 0
        });
      }
  
      const existingProductIndex = userCart.products.findIndex(p => p.productId.toString() === productId && p.size === size);
      if (existingProductIndex > -1) {
        userCart.products[existingProductIndex].quantity += parsedQuantity;
      } else {
        userCart.products.push({
          productId: productId,
          size: size,
          quantity: parsedQuantity,
        });
      }
  
      let totalAmount = 0;
      for (const product of userCart.products) {
        const pr = await Product.findById(product.productId);
        if (pr) {
          totalAmount += pr.price * product.quantity;
        }
      }
  
      userCart.subtotal = totalAmount;
  
      const savedCart = await userCart.save();
  
      res.json({ success: true, message: 'Cart item added', cart: savedCart });
    } catch (error) {
      console.log('Error adding item to cart:', error);
      res.status(500).json({ success: false, message: 'Failed to add item to cart' });
    }
  };
  const wishListAddCart=async(req,res)=>{
    try {
      console.log("entering in to the wishlist cart controlller")
      const { productId,quantity}=req.body
      console.log(productId,quantity)
      const parsedQuantity = parseInt(quantity);
      const userId = req.id.id;
  
      const product = await Product.findById(productId);
      const subtotal = product.price * quantity;
  
      let userCart = await cart.findOne({ user: userId });
      if (!userCart) {
        userCart = new cart({
          user: userId,
          products: [],
          subtotal: 0
        });
      }

     const existingProductIndex = userCart.products.findIndex(p => p.productId.toString() === productId );
    if (existingProductIndex > -1) {
      userCart.products[existingProductIndex].quantity += parsedQuantity;
    } else {
      userCart.products.push({
        productId: productId,
        size:"M",
        quantity: parsedQuantity,
      });
    }

      let totalAmount = 0;
      for (const product of userCart.products) {
        const pr = await Product.findOne({ _id: product.productId }); 
        totalAmount += pr.price * product.quantity;
      }
  
      userCart.subtotal = totalAmount;
  
      const savedCart = await userCart.save();
      console.log('New cart item created:', savedCart);
  
      res.status(200).json({ success: true, message: "Item has been added" });
      const result = await wishlist.findOneAndUpdate(
        { user:userId },
        { $pull: { products: {  productId:  productId} } },
        { new: true }
      )  


      
    } catch (error) {
      console.log(error)
      
    }
  }
  
const deleteCart=async(req,res)=>{
    try {
      const userId=req.id.id
      const id=req.query.id
      console.log("id:",id);
  
      const result = await cart.findOneAndUpdate(
        { user:userId },
        { $pull: { products: {  productId: id} } },
        { new: true }
      )  
      let totalAmount = 0;
      for (const product of result.products) {
        const pr = await Product.findOne({ _id: product.productId });
        totalAmount += pr.price * product.quantity;
      }
      result.subtotal = totalAmount;
      await result.save();  
  console.log(result);
  res.redirect("/cart")
    
    } catch (error) {
      console.log("Error deleting product from cart:", error);
      res.status(500).render("error500", { message: "Internal Server Error" });
      
    }
  }
  
  const editQuantity=async(req,res)=>{
    try {
    console.log("enter in to the edit the quantity")
     const {productId,quantity,totalPrice}=req.body
    console.log(req.body)
     const userId=req.id.id
     const app=await cart.findOne({ user: userId, 'products.productId': productId })
     let totalAmount = app.subtotal
     console.log(totalAmount)
     console.log("save",totalAmount)
     const updatedCart = await cart.findOneAndUpdate( { user: userId, 'products.productId': productId },{ $set: { 'products.$.quantity':quantity,subtotal:totalPrice} },{ new: true })
     res.json({ success: true, updatedCart });
     console.log("update",updatedCart)
  
    } catch (error) {
      console.error('Error in editQuantity function:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' }); 
      
    }
  }
  
  module.exports={
    loadCart,
    addCart,
    wishListAddCart,
    deleteCart,
    editQuantity
  }