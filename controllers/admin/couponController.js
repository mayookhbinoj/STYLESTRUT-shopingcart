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
   const postcoupon=async(req,res)=>{
    try {
        console.log("posted coupon")
        const {name, coupon_code,discount_amount,valid_from,valid_to,Minimum } = req.body;
        console.log(discount_amount,"dis" );
        const newCoupon= new coupon({
            name:name,
            couponCode: coupon_code,
            minimum:Minimum,
            discount_amount: discount_amount,
            valid_from:valid_from,
            valid_to:valid_to
           

        })
        const saveCoupon=await newCoupon.save()
        console.log(saveCoupon,"saved")
        if(saveCoupon){
            res.redirect("/admin/coupon")
        }
        else(
            res.json({message:"failed to save the coupn"})
        )

        
    } catch (error) {
        console.log('something Went wrong to post the coupon', error);
        res.status(500).render("error500").send('Internal Server Error');
    }
   }
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