const jwt = require('jsonwebtoken');
const User=require("../models/userModel");
const { insertUser } = require('../controllers/userController');
require("dotenv").config()
const secret=process.env.JWT_SECRET
const requireAuth=async(req,res,next)=>{
    try {
        console.log(req.cookies);
        const token=req.cookies.jwt
        console.log(token);
     
        if(token){
            jwt.verify(token,secret,(err,decodeToken)=>{
                if(err){
                    console.log(err);
                    res.redirect("/admin")
                }
                else{
                    req.id=decodeToken;
                    next()
                }
            })
        }
        else{
            res.redirect("/admin")
        }
    } catch (error) {
        console.log(error);
    }
}
const requirelogin=async(req,res,next)=>{
    try {
        console.log(req.cookies);
        const token=req.cookies.jwt
        console.log(token);
     
        if(token){
            jwt.verify(token,secret,(err,decodeToken)=>{
                if(err){
                    console.log(err);
                    res.redirect("/")
                }
                else{
                    req.id=decodeToken
                    next()
                }
            })
        }
        else{
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
}
const isBlocked = async (req, res, next) => {
    // const email = req.cookies.email;
    const userId = req.id.id
    console.log(userId);
  
    const user = await User.findById(userId)
    console.log(user);
  
    if (user.blocked==false) {
      next();
    } else {
      res.clearCookie("userToken");
      res.render("isBlocked")
    }
  };
module.exports={
    requireAuth,
    requirelogin,
    isBlocked
}