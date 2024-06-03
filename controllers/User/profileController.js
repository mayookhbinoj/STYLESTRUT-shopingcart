
const adress=require("../../models/addressModel")
const user = require("../../models/userModel");
const Order=require("../../models/orderModel")
const wallet=require("../../models/walletModel")
const otp=require("../../models/otpModel")
require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt=require("bcrypt")
const User = require("../../models/userModel");

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
      console.log("enter in to profile edit load")  
      console.log(req.id);
      const User=await user.findOne({_id:req.id.id})
      console.log(User)
      res.render("profileEdit",{User:User})
    } catch (error) {
      console.log("Error fetching user profile data for editing:", error);
      res.status(500).render("error500").send("Internal Server Error")
      
    }
  }

  const profileOtp=async(req,res)=>{
    try {
     console.log("otp has been sent ")
     const {email}=req.body
    
   
     const userId=req.id.id
     const otpcode = Math.floor(1000 + Math.random() * 9000).toString();
     console.log(otpcode )
    
      console.log(email)
      const newOtp = new otp({
        otp: otpcode,
        userId:userId
      });
      const saveOtp=await newOtp.save()
      console.log(saveOtp)
  
      const transporter = nodemailer.createTransport({
          service:"gmail",
          host : "smtp.gmail.com",
          port: 587,
          secure: false, 
          auth: {
            user: process.env.user_name,
            pass: process.env.user_password,
          },
        });
        
          const mailOptions = {
            from: {
              name: 'Me',
              address:process.env.user_name
            }, // sender address
            to: email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: `Welcome to STYLESTRUT Please verify your email with This Otp${otpcode}`, // plain text body
            html: `Welcome to STYLESTRUT ${otpcode}`, // html body
            
          };
      
          const sendMail = async() => {
              try{
              
                  await transporter.sendMail(mailOptions)
                 
                  console.log("Email sent");
                  res.json({ success: true })
                   
                  
                
              }catch(error)
              {
                  console.log(error.message);
              }
          }
      
          sendMail(transporter,mailOptions)
  
      






    } catch (error) {
      console.log("Error updating user profile:", error);
      res.status(500).render("error500").send("Internal Server Error");
    }
  }
  const updateProfile=async(req,res)=>{
    try {
      console.log("enter in to update profile")
      const{constotp}=req.body
      console.log( typeof constotp)
      const perOtp=constotp.trim()

    
      
      const otpEntry = await otp.findOne({ otp: perOtp });
      if (!otpEntry) {
        console.log("OTP not found");
        return res.json({ success: false, message: "Invalid OTP" });
    }
     
      console.log("otp Entry", typeof otpEntry)
     
      if(perOtp===otpEntry.otp){
        const {name,email,phone}=req.body
        console.log(name,email,phone) 
        const userId=req.id.id
        const updateParameter={
          name:name,
          email:email,
          phone:phone
        }
        const updateUser=await user.findByIdAndUpdate(userId,updateParameter)
        res.json({success:true})
       
      }else{
        res.json({ success: false, message: "Invalid OTP" });

      }
    } catch (error) {
      console.log(error)
    }
  }
  const changePasswordHandler=async(req,res)=>{
    try {
  
   
      const {oldPassword,newPassword}=req.body
      console.log(oldPassword,newPassword);
      const userId=req.id.id
    
      
       const User = await user.findById(userId);
       const isMatch = await bcrypt.compare(oldPassword, User.password);
       if(!isMatch){
        res.json({ success: false, message: 'old password is incorrect' });
       }
       else{
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        User.password = hashedNewPassword;
        const saveData=await User.save()
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
    changePasswordHandler,
    submitReuturn,
    profileOtp,
    updateProfile

  }