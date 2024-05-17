const mongoose = require('mongoose');
const Admin = require("../../models/adminModel");
const User=require("../../models/userModel")
const products=require("../../models/productModel")
const category=require("../../models/categoryModel");
const order=require("../../models/orderModel")
const coupon=require("../../models/couponModel")



const offerLoad=async(req,res)=>{
    try {
        const productData=await products.find()
        console.log("enter in to offerload page");
        res.render("offer",{productData:productData})
    } catch (error) {
        console.log('something Went wrong to load the offerpage', error);
        res.status(500).render("error500").send('Internal Server Error');
    }
}
const productOfferLoad=async(req,res)=>{
    try {
        console.log("enter in to addproduct offerload");
        const productData=await products.find()
     
        res.render("addProductOffer",{productData:productData})
    } catch (error) {
        console.log('something Went wrong to productofferload', error);
        res.status(500).render("error500").send('Internal Server Error');
    }
}
const addProductOffer=async(req,res)=>{
    try {
       console.log("enter in to addproductoffer");
       const {productName,discount}=req.body
       const product = await products.findOne({ name: productName });
       console.log(product.price,"product price");
       const savePrice=product.price
       product.discountPercentage = discount;
       product.actualPrice=savePrice
       const updatedProduct = await product.save()
      
       if(updatedProduct){
       
        const discountedPrice = updatedProduct.price * (1 - discount / 100)
       
        updatedProduct.price = Math.ceil(discountedPrice);
        
        const updatedProductWithPrice = await updatedProduct.save()
        console.log("this update product",  updatedProductWithPrice);
        res.json({success:true})
        
      
       }
    } catch (error) {
        console.log('something Went wrong to add the produfct offer', error);
        res.status(500).render("error500").send('Internal Server Error');
    }
}


module.exports={
    offerLoad,
    productOfferLoad,
    addProductOffer
}