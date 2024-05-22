
const adress=require("../../models/addressModel")
const user = require("../../models/userModel");
const Order=require("../../models/orderModel")

const addressEditLoad=async(req,res)=>{
    try {
      const id= req.query.id 
      const adressFind=await adress.findOne({_id:id})
      res.render("editAdress",{adress:adressFind})
    } catch (error) {
      console.log('Error loading address for editing:', error);
      res.status(500).render("error500").send('Internal Server Error');
    }
  }
  const addressEdit=async(req,res)=>{
    try {
    
     const {street,city,state,ZIPCode,id}=req.body
     console.log(req.body);
     const updateAdress={
      street,city,state,ZIPCode
     }
    
     console.log("updateAdress",updateAdress);
     const update=await adress.findByIdAndUpdate(id,updateAdress)
     console.log("adress",adress);
     res.redirect("/profile")
  
    } catch (error) {
      console.log('Error updating address:', error);
      res.status(500).render("error500").send('Internal Server Error');
      
    }
  }
  const adressDelete=async(req,res)=>{
    try {
      console.log("deleted");
      const id=req.query.id
      const Adressdelete= await adress.deleteOne({_id:id})
      console.log(Adressdelete);
      res.redirect("/profile")
    } catch (error) {
      console.log('Error deleting the adress:', error);
      res.status(500).render("error500").send('Internal Server Error');
    }
  }
  const checkOutSaveAdress=async(req,res)=>{
    try {
      const saveAdress = new adress( {
        street:req.body.street,
        city:req.body.city,
        state:req.body.state,
        ZIPCode:req.body.zipCode,
        user:req.id.id
    })
    await saveAdress.save()
    res.redirect("/checkoutLoad")
  
    } catch (error) {
      console.log(error)
      res.status(500).render("error500").send('Internal Server Error');
    }
  }
  module.exports={

  addressEditLoad,
  addressEdit,
  adressDelete,
  checkOutSaveAdress
  }