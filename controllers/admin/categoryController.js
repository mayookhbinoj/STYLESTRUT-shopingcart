const mongoose = require('mongoose');
const category=require("../../models/categoryModel")


const loadCategory=async(req,res)=>{
    try {
        const categories=await category.find()
        console.log("entered in to catgory")
        res.render("categories",{categories:categories})
    } catch (error) {
        console.log('something Went wrong load categoryPage', error);
        res.status(500).render("error500").send('Internal Server Error');
    }
}
const addCategory=async(req,res)=>{
    try {

        const categorie=await category.findOne({ categoryName: req.body.categoryName })
        const categories=await category.find()
        console.log("add category enterd");
        console.log("body",req.body);
        console.log("files",req.file);
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

        
        const newcategory=new category({
            categoryName:req.body.categoryName,
            description:req.body.description,
            image:req.file.filename
        })
      
        const userData=await newcategory.save()
        console.log("file upload categocatery");
        console.log(userData+"save");
        res.redirect("/admin/category")
    } catch (error) {
        console.log('something Went wrong to add the category', error);
        res.status(500).render("error500").send('Internal Server Error');
       
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
        console.log('something Went wrong edit loadcategory', error);
        res.status(500).render("error500").send('Internal Server Error');
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
        console.log('something Went wrong to update the category', error);
        res.status(500).render("error500").send('Internal Server Error');
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
            console.log('something Went wrong to unlist the category', error);
            res.status(500).render("error500").send('Internal Server Error');
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
            console.log('something Went wrong list the category', error);
            res.status(500).render("error500").send('Internal Server Error');
        }
    }


module.exports={
    loadCategory,
    addCategory,
    editLoadCategory,
    updateEditCategories,
    unlistCategory,
    listCategory

}