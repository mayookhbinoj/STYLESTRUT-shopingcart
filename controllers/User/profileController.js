
const adress=require("../../models/addressModel")
const user = require("../../models/userModel");
const Order=require("../../models/orderModel")
const wallet=require("../../models/walletModel")

const profileLogin=async(req,res)=>{
    try {
      console.log("enter in to profile");
      const userid=req.id.id
      const id=req.query.id
      
      const orderList=await Order.find({userId:userid}).sort({ createdAt: -1 })
    
      const userDetails=await user.findOne({_id:req.id.id })
      const Address=await adress.find({user:req.id.id})
      const User=await user.findOne({_id:req.id.id})
      const saveWallet= await wallet.findOne({userId:userid})
    
    
      
      if(!saveWallet){
        const newWallet= new wallet({
          userId:userid
        })
        const save=await newWallet.save()
        
        
      }
      
  
      res.render("account",{userName: userDetails,Adress:Address,User:User,orderList:orderList,saveWallet:saveWallet })
    } catch (error) {
      console.error("Error in profileLogin:", error);
    res.status(500).send("Internal server error");
    }
  }

  const verifyadressLogin=async(req,res)=>{
    try {
     
      console.log("enterd in to adress post");
     
      const User=req.id.id
      const Adress = new adress( {
        street:req.body.street,
        city:req.body.city,
        state:req.body.state,
        ZIPCode:req.body.zipCode,
        user:req.id.id
    })
  
    const result=await Adress.save()
    console.log(result);
  
      res.redirect("/profile")

 

    } catch (error) {
      console.error("Error creating address:", error);
      if (error.name === "ValidationError") {
       
        return res.status(400).send("Validation error: " + error.message);
      } else {
      
        return res.status(500).send("Internal server error");
      }
      
    }
  }
  const profileEditLoad=async(req,res)=>{
    try {
      console.log(req.id);
      const User=await user.findOne({_id:req.id.id})
      res.render("profileEdit",{User:User})
    } catch (error) {
      console.log("Error fetching user profile data for editing:", error);
      res.status(500).render("error500").send("Internal Server Error")
      
    }
  }

  const profileEdit=async(req,res)=>{
    try {
      console.log("update profile");
      const profileEdit=req.id.id
      console.log(profileEdit);
     
   
      
      const {name,email,phone}=req.body
      console.log(req.body);
      const updateProfile={
        name,email,phone
      }
      console.log(updateProfile);
      const profileUpdate=await user.findByIdAndUpdate(profileEdit,updateProfile)  
      console.log(profileUpdate); 
      res.redirect("/profile")   
    } catch (error) {
      console.log("Error updating user profile:", error);
      res.status(500).render("error500").send("Internal Server Error");
    }
  }
  const changePasswordHandler=async(req,res)=>{
    try {
  
   
      const {oldPassword,newPassword}=req.body
      console.log(oldPassword,newPassword);
      const userId=req.id.id
    
      
       const User = await user.findById(userId);
       const isMatch = await bcrypt.compare(oldPassword, user.password);
       if(!isMatch){
        res.json({ success: false, message: 'password incorrect' });
       }
       else{
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        const saveData=await user.save()
        console.log(saveData,);
        res.json({ success: true, message: 'pasword has been changed' });
       }
       
    
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  const submitReuturn=async(req,res)=>{
    try {
      
      console.log("enter in to submit return ");
      const {id}=req.query
      console.log(id);
      const statusUpdate= await Order.findByIdAndUpdate({_id:id},{
        status:"Requested for return"},{new:true})
     
         
          res.json({ success: true, message: 'the product has been returned.' });
   
       
     
      
    
    } catch (error) {
      console.log(error);
    }
  }
  

  module.exports = {
    profileLogin,
    verifyadressLogin,
    profileEditLoad,
    profileEdit,
    changePasswordHandler,
    submitReuturn

  }