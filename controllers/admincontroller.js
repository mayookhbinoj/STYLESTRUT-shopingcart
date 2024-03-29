const mongoose = require('mongoose');
const Admin = require("../models/adminModel");
const User=require("../models/userModel")
const products=require("../models/productModel")
const category=require("../models/categoryModel");
const jwt=require("jsonwebtoken")


 const createToken = (admin)=>{
        const JWT_SECRET = process.env.JWT_SECRET
        return jwt.sign(admin,JWT_SECRET,{expiresIn:"1h"})

}


const showAdminLogin = (req, res) => {
   try {
    res.render("login")
   } catch (error) {
    console.log(error);
   }
};



const verifyAdmin=async(req,res)=>{
    

    try {
        const email=req.body.email
         const password=req.body.password
        const admin = await Admin.findOne({email:email });
        console.log("Email:", email);
        console.log(admin);
        if (!admin) {
            return res.render("login", {messege: "Email and password is incorect" });
        }
        if(password === admin.password){
            // req.session.user_id=admin._id
            const token = createToken({id:admin._id})
            console.log(token);
            res.cookie("jwt",token,{httpOnly:true,maxAge:600000000})

            res.redirect("/admin/home")
            
        }
        else{
            console.log("wrong");
            res.render("login",{messege:"Email and password is incorect"})
        }

      
    } catch (error) {
     console.log(error);
        
    }
}
const loadAdminHome=async(req,res)=>{
    try {
        res.render("home")
    } catch (error) {
        console.log(error);
        
    }
}
const logoutAdmin=async(req,res)=>{
    try {
        // req.session.destroy()
        res.clearCookie("jwt")
        res.redirect("/admin")
    } catch (error) {
        console.log(error);
        
    }
}
const listUser=async(req,res)=>{
   try {
  const userData=await User.find({is_varified:0})
  console.log("hi  "+userData);
  res.render("userlist",{users:userData})
  console.log('userdata',userData);
    
   } catch (error) {
    console.log(error);
    res.send(500).send("internal sever Error")
   }
}
const blockUser=async(req,res)=>{
    
    try {
        const id=req.params.id
        console.log(id);
        await User.findByIdAndUpdate(id,{blocked:true})
        console.log(id);
        res.sendStatus(200).send('User has been blocked. Please contact the admin for further assistance.');

    } catch (error) {
     console.log(error);
    //  res.sendStatus(500)
        
    }
}
const unblockUser=async(req,res)=>{
    try {
         const id=req.params.id
         console.log(id);
        await User.findByIdAndUpdate(id,{blocked:false})
        res.sendStatus(200)
     
    } catch (error) {
        console.log(error);
        // res.sendStatus(500)
      
    }
}

const loadCategory=async(req,res)=>{
    try {
        const categories=await category.find()
        console.log("entered in to catgory")
        res.render("categories",{categories:categories})
    } catch (error) {
        console.log(error);
    }
}

const addCategory=async(req,res)=>{
    try {

        const categorie=await category.findOne({ categoryName: req.body.categoryName })
        const categories=await category.find()
        console.log("add category enterd");
        console.log(req.body);
        console.log(req.file);
        if (!req.body.categoryName ) {
            return res.render('categories', { same: 'Name field cannot be empty. Please enter your name.' ,categories:categories});
        }
       if(categorie){
        return res.render('categories', {name: 'Category name already exists. Please use a different name.',categories:categories });
       }
       console.log(req.file);
       if (!req.body.description ) {
           return res.render('categories', { description: 'description field cannot be empty. .' ,categories:categories});
       }
       
        if (!req.file) {
              return res.render('categories', { image: 'Please upload an image.', categories: categories });
       }

        if (!req.file.mimetype.startsWith('image')) {
              return res.render('categories', { image: 'Please upload a valid image file.', categories: categories });
       } 


        const fileSizeLimit = 5 * 1024 * 1024; 
         if (req.file.size < fileSizeLimit) {
             return res.render('categories', { images: 'Please select an image file up to 5 MB in size.', categories: categories });
         }
        const newcategory=new category({
            categoryName:req.body.categoryName,
            description:req.body.description,
            image:req.file.filename
        })
      
        const userData=await newcategory.save()
        console.log("file upload categocatery");
        console.log(userData);
        res.redirect("/admin/category")
    } catch (error) {
        console.log(error);
       
    }
}
const editLoadCategory=async(req,res)=>{
    try {
        
        const id=req.query.id
        const categories=await category.findOne({_id:id})
        console.log(id);
        if(categories){
            res.render("categoriesEdit",{category:categories})
        }
        
    } catch (error) {
        
    }
}
const updateEditCategories=async(req,res)=>{
try {
     console.log("wedone");
     console.log(req.body);
     console.log(req.file);
     const {categoryName,description,category_id} = req.body
    const updateParameters = {
        categoryName : categoryName,
        description  :description
    }
    if(req.file){
        updateParameters.image =req.file.filename
    }
        const userData=await category.findByIdAndUpdate(category_id,
            updateParameters
        )
        console.log(userData);
 
  res.redirect("/admin/category")   
} catch (error) {
    console.log(error);
}

}
const unlistCategory=async(req,res)=>{
   
    try {
      const userId=req.query.id
      console.log(userId);
      const updatedCategory  = await category.findOneAndUpdate({_id:userId}, { isListed: true }, { new: true });
     
      console.log(updatedCategory);
      res.json({ success: true, message: 'User unlisted successfully.' });
     
    } catch (error) {
        console.log(error);
    }
}
const listCategory=async(req,res)=>{
   
    try {
      const userId=req.query.id
     console.log(userId);
      const updatedCategory  = await category.findOneAndUpdate({_id:userId}, { isListed: false }, { new: true });
      console.log(updatedCategory);
      res.json({ success: true, message: 'User listed successfully.' });
     

    } catch (error) {
        console.log(error);
    }
}



const loadaddNewProduct=async(req,res)=>{
    try {
        console.log("enterd to add new ");
        const categories = await category.find();

        res.render("addproduct",{ categories: categories })
    } catch (error) {
        console.log(error);
        
    }
}
const loadproductList=async(req,res)=>{
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
                    category: {$arrayElemAt: ["$categoryInfo.categoryName", 0] } 
                }
            },
            

        ]);
        
     
        

     
        console.log("welcome product list");
        res.render("productlist",{productData:productData})
    } catch (error) {
        console.log(error);
    }
}

const addNewproduct=async(req,res)=>{
try {
 
  console.log("dfasjkhfkjjhdskjf");
//   const categories=await category.findOne({isListed:false})
  const {name,price,color,stock,details,brand,description,category}=req.body

  const files = req.files
  console.log(req.files);
  console.log("rewqrqwrqwrrwqrqwjgfjdsjfgwgeafggugewjguyueg",req.body);
    const image = files.map(file => file.filename);
    const Newproduct= new products ({
        name,
        price,
        color,
        stock,
        details,
        brand,
        image,
        description,
        category
    })
   await Newproduct.save()
//    console.log(result);
   res.redirect("/admin/productslist")

} catch (error) {
    console.log(error);
}

}

const editLoadProduct=async(req,res)=>{
    try {
        console.log("enter in to loadedi");
        const id=req.query.id
        console.log(id);    
        const product=await products.findOne({_id:id})
        console.log(id);
        if(product){
            res.render("editProduct",{product:product})
        }
        
    } catch (error) {
        console.log(error)
        
    }
}
const updateproduct=async(req,res)=>{
    try {
        console.log("update product");
      
       console.log(req.file);
       const {name,price,stock,details,brand,product_id} = req.body
       console.log(req.body);
   
       const updateParameters = {
         name:name,
         price:price,
         stock:stock,
         details:details,
         brand:brand
    }
    if(req.file){
        updateParameters.image = req.file.filename
    }
    console.log(updateParameters);
       await products.findByIdAndUpdate(product_id,
            updateParameters
        )

     
      res.redirect("/admin/productslist")

    } catch (error) {
        console.log(error);
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
        console.log(error);
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
        console.log(error);
        
    }
}




module.exports = {
    showAdminLogin,
    verifyAdmin,
     loadAdminHome,
     logoutAdmin,
     listUser,
     blockUser,
     unblockUser,
     loadCategory,
     addCategory,
     editLoadCategory,
     updateEditCategories,
     loadproductList,
     loadaddNewProduct,
     addNewproduct,
     editLoadProduct,
     updateproduct,
     unlistProduct,
     listProduct,
     unlistCategory,
     listCategory,
  
};