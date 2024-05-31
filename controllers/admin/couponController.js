const mongoose = require('mongoose');
const Admin = require("../../models/adminModel");
const User=require("../../models/userModel")
const products=require("../../models/productModel")
const category=require("../../models/categoryModel");
const order=require("../../models/orderModel")
const coupon=require("../../models/couponModel")
const couponLoad=async(req,res)=>{
    try {
     
        console.log("enter in to coupon load");
        const couponData=await coupon.find()
        res.render("Coupon",{couponData:couponData})
    } catch (error) {
        console.log('something Went wrong load the coupon load', error);
        res.status(500).render("error500").send('Internal Server Error');
    }
   }  

const addcouponLoad=async(req,res)=>{
    try {
        console.log("enter in to addcoupon")
        res.render("addCoupon")
    } catch (error) {
        console.log('something Went wrong addcoupon loading ', error);
        res.status(500).render("error500").send('Internal Server Error');
    }
   }
   const postcoupon = async (req, res) => {
    try {
        console.log("Attempting to post coupon");

        const { name, coupon_code, discount_amount, Minimum } = req.body;
        console.log(discount_amount, "discount amount");

        const sameCoupon = await coupon.findOne({ couponCode: coupon_code });
        if (sameCoupon) {
            console.log("A coupon with the same code has been found");
            return res.json({ success: false, message: "Coupon already exists" });
        }

        const newCoupon = new coupon({
            name: name,
            couponCode: coupon_code,
            minimum: Minimum,
            discount_amount: discount_amount,
        });

        const saveCoupon = await newCoupon.save();
        console.log(saveCoupon, "Coupon saved successfully");

        if (saveCoupon) {
            res.json({ success: true, message: "Coupon added successfully" });
        } else {
            res.json({ success: false, message: "Failed to save the coupon" });
        }
    } catch (error) {
        console.log('Something went wrong while posting the coupon:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


   const couponDelte=async(req,res)=>{
    try {  
        const id=req.query.id
        console.log(id);
        console.log("enter in to couponDelete");
        const deletedCoupon = await coupon.findByIdAndDelete(id)
        res.json({sucess:true})

    } catch (error) {
        console.log('something Went wrong to delete  the coupon', error);
        res.status(500).render("error500").send('Internal Server Error');
    }
   }
   
module.exports={
    couponLoad,
    addcouponLoad,
    postcoupon,
    couponDelte
   }