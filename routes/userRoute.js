const express=require("express")
const userRoute=express()
const passport = require("passport");
const aut=require("../middleware/auth")
require("../auth")
require("../face")
function isLoggedin(req,res,next){
    rq.user? next():res.sendStatus(401) 
}

const path = require("path");
userRoute.use(express.static("images"))
const session=require("express-session")
userRoute.use(session({secret:"cats"}))
userRoute.use(passport.initialize())
userRoute.use(passport.session())


const config=require("../config/config")


const auth=require("../middleware/auth")
const userController=require("../controllers/userController")
userRoute.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: true.valueOf,
}))
userRoute.use(express.static(path.join(__dirname, "../public")));



userRoute.set("view engine","ejs")
userRoute.set("views","./views/user")


const bodyparser=require("body-parser")
userRoute.use(bodyparser.json())
userRoute.use(bodyparser.urlencoded({extended:true}))




// const Employee = require("../models/userModel");

const adminRoute = require("./adminroute");

userRoute.get("/register",userController.loadRegister)
userRoute.post("/generateotp",userController.insertUser)

//login
userRoute.get("/",userController.userLoadLogin)
userRoute.get("/loginload",aut.requirelogin,userController.userLoadLogin)
userRoute.post("/login",userController.verifyLogin)
userRoute.get("/logout",userController.Userlogout)


//google sign 
userRoute.get("/auth/google",passport.authenticate("google",{scope:['email','profile']}))
userRoute.get("/google/callback",passport.authenticate("google",{successRedirect:'/home',failureRedirect:'/auth/failure'}))
userRoute.get("/failure",isLoggedin,(req,res)=>{
    res.send("something went wrong")
})
userRoute.get("/auth/facebook",passport.authenticate("facebook",{scope:'email'}))
userRoute.get("/facebook/callback",passport.authenticate("facebook",{successRedirect:'/home',failureRedirect:'/auth/failure'}))

//otp
userRoute.get("/sendOtp",userController.getOtp)
userRoute.post("/sendOtp",userController.getOtp)
userRoute.post("/verifyotp",userController.otpCheck)

userRoute.get("/resend",userController.getOtp)

//home
userRoute.get("/home",aut.requirelogin,aut.isBlocked,userController.loadHome)
userRoute.get("/single-product",aut.requirelogin,aut.isBlocked,userController.singleproductLoad)







module.exports=userRoute