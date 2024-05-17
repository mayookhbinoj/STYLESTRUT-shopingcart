const mongoose = require('mongoose');
const products=require("../../models/productModel")
const category=require("../../models/categoryModel");
const loadProductList=async(req,res)=>{
    try {
  
        const productData = await products.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryInfo"
                }
            },
          
            {
                $project: {
                    name: 1,
                    price: 1,
                    stock: 1,
                    details: 1,
                    brand: 1,
                    image: 1,
                    isListed:1,
                    category: {$arrayElemAt: ["$categoryInfo.categoryName", 0] } ,
                    sizes:1
                }
            },
            

        ]);
        

     
        console.log("welcome product list");
        res.render("productlist",{productData:productData})
    } catch (error) {
        console.log('something Went wrong to load the productlist', error);
        res.status(500).render("error500").send('Internal Server Error');
    }
}
const loadAddNewProduct=async(req,res)=>{
    try {
        console.log("enterd to add new ");
        const categories = await category.find();

        res.render("addproduct",{ categories: categories })
    } catch (error) {
        console.log('something Went wrong to load the new product', error);
        res.status(500).render("error500").send('Internal Server Error');
    }
}
const addNewproduct=async(req,res)=>{
    try {
     
      console.log("enter in to product edit");
    //   const categories=await category.findOne({isListed:false})
      const {name,price,color,details,brand,description,category}=req.body
      const sizes = req.body.sizes;
      const quantities = req.body.quantities;
      console.log(sizes);
      console.log(quantities);
      const sizeQuantities = [];
      for (let i = 0; i < sizes.length; i++) {
        sizeQuantities.push({
            size: sizes[i],
            quantity: quantities[i]
        });
    }   
    
      const files = req.files
      console.log(req.files);
      console.log(req.body);
        const image = files.map(file => file.filename);
        console.log(image,"image");
        const discountPercentage = 0
        const Newproduct= new products ({
            name,
            price,
            color,
            details,
            brand,
            discountPercentage,
            image,
            description,
            category,
            sizes: sizeQuantities,
            createdAt: new Date()
        })
       await Newproduct.save()
    //    console.log(result);
       res.redirect("/admin/productslist")
    
    } catch (error) {
        console.log('something Went wron to add the new product', error);
        res.status(500).render("error500").send('Internal Server Error');
    }
    
    }
const updateProduct=async(req,res)=>{
        try {
            console.log("update product");
          
           console.log(req.file);
           const {name,price,details,brand,product_id,} = req.body
           let sizes = req.body.sizes;
           console.log("sizes",sizes) 
           let quantities = req.body.quantities
           let quantity_id = req.body.quantity_id
           console.log("quan",quantity_id)
           const product = await products.findById(product_id)
           let sizeQuantities = {};
           quantity_id.forEach((id, index) => {
               sizeQuantities[id] = quantities[index];
           });
        
           console.log("sizeQuantities", sizeQuantities);   
           const updateParameters = {
             name:name,
             price:price,
             details:details,
             brand:brand,
             sizes: [] 
            
           

        }
        const s = ['M', 'L', 'XL'];
        quantity_id.forEach((id, index) => {
            updateParameters.sizes.push({
                _id: id,
                quantity: quantities[index],
                size: s[index]
            });
        })
      
      
        if(req.file){
            updateParameters.image = req.file.filename
        }
        console.log(updateParameters);
          const saveData= await products.findByIdAndUpdate(product_id,
                updateParameters
            )
            
            console.log("savedata",saveData)
    
         
          res.redirect("/admin/productslist")
    
        } catch (error) {
            console.log('something Went wrong to load the update the product', error);
            res.status(500).render("error500").send('Internal Server Error');
        }
    }
const unlistProduct=async(req,res)=>{
        try {
            const id=req.query.id
            console.log("product"+id);
            const productId=await products.findOneAndUpdate({_id:id},{isListed:true},{new:true})
            console.log(productId);
            res.json({ success: true, message: 'User unlisted successfully.' });
        } catch (error) {
            console.log('something Went wrong to unlist the product', error);
            res.status(500).render("error500").send('Internal Server Error');
        }
    }    

const listProduct=async(req,res)=>{
        try {
            const id=req.query.id
            console.log("list"+id);
            const product=await products.findOneAndUpdate({_id:id},{isListed:false},{new:true})
            console.log(product);
            res.json({ success: true, message: 'User unlisted successfully.' });
        } catch (error) {
            console.log('something Went wrong to list the product', error);
            res.status(500).render("error500").send('Internal Server Error');
            
        }
    }
    const editLoadProduct=async(req,res)=>{
        try {
            console.log("enter in to loadedi");
            const id=req.query.id
            console.log(id);    
            const product=await products.findOne({_id:id})
            console.log(id);
            console.log("pp",product.sizes);
            if(product){
                res.render("editProduct",{product:product})
            }
            
        } catch (error) {
            console.log('something Went wrong to load the editproduct', error);
             res.status(500).render("error500").send('Internal Server Error');
            
        }
    }
    
    
    module.exports={
        loadProductList,
        loadAddNewProduct,
        addNewproduct,
        updateProduct,
        unlistProduct,
        listProduct,
        editLoadProduct
    }