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

const orderComplete=async(req,res)=>{
    try {
    
      res.render("orderSucess")
    } catch (error) {
      console.log(error);
    }
  }
  const orderSucess=async(req,res)=>{
    try {
      console.log("enter in to order sucess ");
      const userid=req.id.id
      console.log(userid);
      // const cartItems=await cart.findOne({user:userid})
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
                size: "$products.size",
                coupon: 1 
            }
        },
        
    ]);
      console.log("cart items",cartItems);
    
      const {  id, paymentMethod } = req.query
      console.log(paymentMethod);
   
      const cartIt=await cart.find({user: userid})
      let total=cartIt[0].subtotal
      console.log("Total Price:", total);
    console.log(cartItems,"total");
    const coupon =  cartItems.length > 0 ?  cartItems[0].coupon : "Not Applied";
      const orderCreate=new Order({
        userId:userid,
        addressId:id,
        paymentMethod:paymentMethod,
        cartItems:cartItems,
        total:total,
        coupon: coupon 
        
        
      })
      console.log(orderCreate);
      const neworder=  await orderCreate.save()

      if(neworder){
        for (const item of cartItems) {
          const productId = item.product._id;
          const orderedQuantity = item.quantity;
          const size = item.size
          console.log(size);
        
          await Product.updateOne(
            { _id: productId, "sizes.size": size }, 
            { $inc: { "sizes.$.quantity": -orderedQuantity } }
        );
      }
      if (paymentMethod === 'Wallet Payment') {
      const userId=req.id.id
      const s=await wallet.findOne({userId:userId})
        s.totalAmount -= total;
        const saveWallet= await s.save()
      
      console.log("Save total",saveWallet)
      
    }
        res.json({success:"truueee"})
        const userId=req.id.id
        const deletedCart = await cart.findOneAndDelete({ user: userId });
        return deletedCart;
      } 
      else{
        console.log("Failed to save order.");
      }
      
      

      
    } catch (error) {
      console.error("Error in ordersuccess function:", error);
      res.status(500).render("error500", { message: "Internal Server Error" });
    }
}

const onlineOrder = async (req, res) => {
  try {
      console.log("Enter into online success");
      const userId = req.id.id;
      console.log(userId);

      
      const cartData = await cart.aggregate([
          {
              $match: { user: new mongoose.Types.ObjectId(userId) }
          },
          {
              $project: {
                  _id: 0,
                  products: 1,
                  coupon: 1 // Include coupon field
              }
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
                  product: "$productDetails",
                  quantity: "$products.quantity",
                  size: "$products.size",
                  coupon: 1 
              }
          }
      ]);

      console.log("Cart items", cartData);

    
      const total = cartData.reduce((acc, item) => {
          return acc + (item.product.price * item.quantity);
      }, 0);
      console.log("Total Price:", total);

     
      const coupon = cartData.length > 0 ? cartData[0].coupon : "Not Applied";

     
      const orderCreate = new Order({
          userId: userId,
          addressId: req.query.id,
          paymentMethod: "Online",
          cartItems: cartData,
          total: total,
          coupon: coupon 
      });

      console.log(orderCreate);
      const newOrder = await orderCreate.save();

      if (newOrder) {
          // Update product quantities
          for (const item of cartData) {
              const productId = item.product._id;
              const orderedQuantity = item.quantity;
              const size = item.size;
              console.log(size);

              await Product.updateOne(
                  { _id: productId, "sizes.size": size },
                  { $inc: { "sizes.$.quantity": -orderedQuantity } }
              );
          }

          res.redirect("/ordersucess");

          // Delete cart after successful order
          const deletedCart = await cart.findOneAndDelete({ user: userId });
          console.log(deletedCart);

          return deletedCart;
      } else {
          console.log("Failed to save order.");
      }
  } catch (error) {
      console.error("Error in onlineOrder function:", error);
      res.status(500).render("error500", { message: "Internal Server Error" });
  }
};

  const orderView=async(req,res)=>{
    try {
      console.log("enter in to order view");
      const orderId = req.query.id;
      console.log(orderId);
      const order = await Order.findOne({_id:orderId});
      const AdressId= order.addressId
      const Adresss=await adress.findOne({_id:AdressId})
      console.log(Adresss);
      console.log("order",order,);
      console.log(order.cancel,"ordercancel");
    
        res.render("orderView",{order:order,Adresss:Adresss})
      
      
    } catch (error) {
     
      console.log(error);
      res.status(500).render('error500', { message: 'Internal Server Error' });
    }
  }
  const orderCancel=async(req,res)=>{
    try {
     console.log("enter in to cancel");
     const {id}=req.query
     console.log(req.query)
     const order=await Order.findOne({_id:id})
     
       if (order.paymentMethod === "Online") {
       const userId=req.id.id
       for (const product of order.cartItems) {
        let Wallet = await wallet.findOne({ userId: userId });
        if (!Wallet) {
            Wallet = new wallet({ userId: userId });
            

        }
        Wallet.refund.push({
            productName: product.product.name,
            amount: order.total
        });

       
        Wallet.totalAmount += parseInt(order.total)
        console.log(Wallet.totalAmount);

       
        await Wallet.save();
        const cancelOrder=await Order.findOneAndUpdate({_id:id},{cancel:true,status: 'cancel'},{new:true})
        res.json({ success: true, message: 'order has been canceled.' });
    }
    
    }else{
      const cancelOrder=await Order.findOneAndUpdate({_id:id},{cancel:true,status: 'cancel'},{new:true})
        res.json({ success: true, message: 'order has been canceled.' }); 
    }

      
  } catch (error) {
    
      console.log(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
  }
  

  module.exports={
    orderSucess,
    orderComplete,
    onlineOrder,
    orderView,
    orderCancel,
  }