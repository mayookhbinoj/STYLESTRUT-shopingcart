const user = require("../../models/userModel");
const wishlist=require("../../models/Wishlist")
const mongoose=require("mongoose");

const wishListLoad=async(req,res)=>{
    try {
      const User=await user.findOne({_id:req.id.id})
      console.log(User,"userrrrrr");
      const userId=req.id.id
      console.log(userId);
      const wishlistnew = await wishlist.aggregate([
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
                productId: "$productDetails._id",
                productName: "$productDetails.name",
                productPrice: "$productDetails.price",
                productDescription: "$productDetails.details",
                productImage: { $arrayElemAt: ["$productDetails.image", 0] }
            
            }
        }
    ]);
    console.log("Wishlist:", wishlistnew );
     
  
      res.render("wishlist",{wishlist:wishlistnew,User:User})
    } catch (error) {
      console.error("Error loading wishlist:", error);
      return res.status(500).render("error500", { statusCode: 500, errorMessage });
    }
  }

  const  Addwishlist= async(req,res)=>{
    try {
      console.log("enter in to wishlist add");
      const userId=req.id.id
      console.log(userId);
      const { productId } = req.body;
      console.log(productId,"product id");
      let wishlistNew = await wishlist.findOne({ user: userId });
      if(! wishlistNew){
        wishlistNew=new wishlist({
          user:userId,
          products:[]
        })
    
    }
    const productExists = wishlistNew.products.some(product => product.productId.toString() === productId);

        if (productExists) {
            return res.json({ success: false, message: 'Product is already in the wishlist' });
        }

      
      wishlistNew.products.push({
        productId:productId
      })
    const savewishlist=  await wishlistNew.save();
    console.log(savewishlist);
    res.json({ success: true, message: 'wishlist item is added' });
   
      
  
    } catch (error) {
      console.log(error);
      console.error("Error Adding  wishlist:", error);
      return res.status(500).render("error500", { statusCode: 500, errorMessage });
    }
  }


  const deletewishlist=async(req,res)=>{
    try {
      console.log("deleted wishlist");
      const userId=req.id.id
     const id=req.query.id
     console.log(id);
     const result = await wishlist.findOneAndUpdate(
      { user:userId },
      { $pull: { products: {  productId: id} } },
      { new: true }
    )  
      if(result){
      res.redirect("/wishlistLoad")
      }
  
  
    } catch (error) {
      console.log(error);
      console.error("Error Deleting wishlist:", error);
      return res.status(500).render("error500", { statusCode: 500, errorMessage });
      
    }
  }

  module.exports={
    wishListLoad,
    Addwishlist,
    deletewishlist
    
  }