const user = require("../models/userModel");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
require("dotenv").config();
const bcrypt=require("bcrypt")
const speakeasy=require("speakeasy")
const otp=require("../models/otpModel")
const Product=require("../models/productModel")
const jwt=require("jsonwebtoken")

require("../auth")


const createToken = (user)=>{
  const JWT_SECRET = process.env.JWT_SECRET
  return jwt.sign(user,JWT_SECRET,{expiresIn:"1h"})

}


const securePasword=async(password)=>{
try {
  const passwordMatch=await bcrypt.hash(password,10)
    return passwordMatch
  }
 catch (error) {
  console.log(error.message);
  
}
}

const loadRegister = async (req, res) => {
  try {
    const errorMessage = req.session.errorMessage || '';
    req.session.errorMessage = ''; 
    res.render("register", { errorMessage });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};


const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const insertUser = async (req, res) => { 
   try {
   
   
      const spassword=await securePasword(req.body.password)
      const existingUser = await user.findOne({ email: req.body.email });
      if (!req.body.name) {
        return res.render('register', { message: 'Name field cannot be empty. Please enter your name.' });
    }
      if (existingUser) {
        return res.render('register', { message: 'Email already exists. Please use a different email.' });
    }
    if (!validatePassword(req.body.password)) {
      return res.render('register', { message: 'Password must contain at least one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long.' });
  }
  
      const users = new user( {
          name:req.body.name,
          email:req.body.email,
          phone:req.body.phone,
          password:spassword  
      })
      const result=await users.save()





      console.log(result);
    
      if(result){
     const token = createToken({id:result._id})
      console.log(token); 
      res.cookie("jwt",token,{httpOnly:true,maxAge:600000000}) 
          
        res.render("sentotp",{message:"Your registration has been sucessfull"})
    }
    else{
        res.redirect("/register",{message:"Your registration has been failed"})
    }
  
  }
 
catch (error) {
  console.log(error);
  

  
}
  
}

const loadHome = async (req, res) => {
  
  try {
  
    
    const product=await Product.find({isListed:false})
   
    res.render("home",{product:product});
  
  } catch (error) {
    console.log(error.message);
  }
};

const userLoadLogin = async (req, res) => {
  try {
    res.render("userlogin");
  } catch (error) {
    console.log(error.message);
  }
};
const verifyLogin=async(req,res)=>{
try{
  const email=req.body.email
  const password=req.body.password
   const userData= await user.findOne({email:email})
  console.log(req.body);
   
     
   if(userData.blocked){
    console.log("blocked")
    res.render("/loginload",{message:"your account has been blocked "})
   
   }
   console.log(userData);
   if(userData){
    console.log(userData);
    const passwordMatch=await bcrypt.compare(password,userData.password)
    if(passwordMatch){
      const us= req.session.user_id=userData._id
      console.log("login session"+us);
      const token = createToken({id:userData._id})
      console.log(token);
      res.cookie("jwt",token,{httpOnly:true,maxAge:600000000}) 
      res.redirect("/home")
    }
    else{
      console.log("error ");
      res.render("userlogin",{message:"email  and password is incorrect"})  
    }
   }
   else{
    res.render("userlogin",{message:"email  and password is incorrect"})  

   }
  
}

  catch (error) {
    
    console.error(error);
        res.status(500).send("Internal Server Error");
  }
 
}
const Userlogout=async(req,res)=>{
  try {
    req.session.destroy()
    res.clearCookie("jwt")
    res.redirect("/")
  } catch (error) {
    console.log(error);
  }
}

const getOtp= async (req,res)=>{
  try {
    const otpcode = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(otpcode+" code")
    const newOtp = new otp({
      otp: otpcode,
     
  });
    const savedOtp = await newOtp.save();
        console.log("OTP saved successfully:", savedOtp); 

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
          to: "pinicis712@cmheia.com", // list of receivers
          subject: "Hello ✔", // Subject line
          text: `Your OTP is ${otpcode}`, // plain text body
          html: `Your OTP is ${otpcode}`, // html body
          
        };
    
        const sendMail = async() => {
            try{
            
                await transporter.sendMail(mailOptions)
               
                console.log("Email sent");
                
                res.render('verifyotp')
              
            }catch(error)
            {
                console.log(error.message);
            }
        }
    
        sendMail(transporter,mailOptions)

    

}catch (error) {
    console.log(error);
    const errorMessage = "Internal Server Error";
    // return res.status(500).render("errorPage", { statusCode: 500, errorMessage })
}
}







  const otpCheck = async (req, res) => {
    try {
      const enteredOtp = req.body.otp; 
     const otpEntry = await otp.findOne({ otp: enteredOtp });
     console.log("fdasfasf"+otpEntry);
     if(req.body.otp===""){
      res.json({ validataion: true, validation: 'OTP is not verified or has expired' });
     }
     if (otpEntry !== null && Date.now() - otpEntry.created_at.getTime() <= 60000) {
    
      res.json({ otpverified: true, message: 'OTP is verified' });
  } else {
      res.json({ otpverified: false, message: 'OTP is not verified or has expired' });
  }
      
    } catch (error) {
      console.log(error); 
    }
    
  
  }


const singleproductLoad=async(req,res)=>{
  try {
   console.log("enter  in to single product");
   const id= req.query.id 
   const productData= await Product.findOne({_id:id})
   const similarproduct=await Product.find({category:productData.category})

   if(productData ){
    res.render("productDetail", { product: productData ,similarproduct:similarproduct});
   }
   
  } catch (error) {
    console.log(error);
    
  }
}


module.exports = {
  loadRegister,
  insertUser,
  loadHome,
  userLoadLogin,
  verifyLogin,
  Userlogout,
  getOtp,
  otpCheck,
  singleproductLoad
  
  
};
