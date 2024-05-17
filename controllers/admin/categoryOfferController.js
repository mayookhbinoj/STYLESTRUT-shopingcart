const mongoose = require('mongoose');
const Admin = require("../../models/adminModel");
const User=require("../../models/userModel")
const products=require("../../models/productModel")
const category=require("../../models/categoryModel");
const order=require("../../models/orderModel")
const coupon=require("../../models/couponModel")

const categoryOfferLoad=async(req,res)=>{
    try {
        console.log("enter in to category offer load")
        const categoryFind=await category.find()
        console.log(categoryFind)
        res.render("addCategory",{categoryFind:categoryFind})
      
    } catch (error) {
        console.log(error)
    }
}
const addCateogryOffer = async (req, res) => {
    try {
        console.log("Offer has been posted");
        const { categories, discount } = req.body;
        const findCategory = await category.findOne({ categoryName: categories });
        const categoryId = findCategory._id;
        const findProducts = await products.find({ category: categoryId });

        for (const product of findProducts) {
            const savePrice = product.price;
            product.discountPercentage = discount;
            product.actualPrice = savePrice;

            const discountedPrice = savePrice * (1 - discount / 100);
            product.price = Math.ceil(discountedPrice);

            const updatedProduct = await product.save();
            console.log("Updated product:", updatedProduct);
        }

        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while updating products" });
    }
};

module.exports = {
    addCateogryOffer
};
module.exports={
    categoryOfferLoad,
    addCateogryOffer
}