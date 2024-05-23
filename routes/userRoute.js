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
const userController=require("../controllers/User/userController")
const loginController=require("../controllers/User/loginController")
const googleController=require("../controllers/User/googleController")
const profileController=require("../controllers/User/profileController")
const otpController=require("../controllers/User/otpController")
const searchController=require("../controllers/User/searchController")
const homeController=require("../controllers/User/Homecontroller")
const adressController=require("../controllers/User/adressController")
const checkoutController=require("../controllers/User/checkoutController")
const cartcontroller=require("../controllers/User/cartController")
const wishListControler=require("../controllers/User/wishlistController")
const paymentController=require("../controllers/User/paymentController")
const orderController=require("../controllers/User/orderController")
const retryPaymentController=require("../controllers/User/failurePaymentController")

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
userRoute.get("/",loginController.loadLandingPage)
userRoute.get("/login",loginController.userLoadLogin)
userRoute.get("/loginload",aut.requirelogin,loginController.userLoadLogin)
userRoute.post("/login",loginController.verifyLogin)
userRoute.get("/logout",loginController.userlogout)


//google sign 
userRoute.get("/auth/google",passport.authenticate("google",{scope:['email','profile']}))

userRoute.get("/google/callback",passport.authenticate("google",{successRedirect:'/verifygoogle',failureRedirect:'/auth/failure'}))
userRoute.get("/verifygoogle",googleController.verifyGoogle)
userRoute.get("/failure",isLoggedin,(req,res)=>{
    res.send("something went wrong")
})
userRoute.get("/auth/facebook",passport.authenticate("facebook",{scope:'email'}))
userRoute.get("/facebook/callback",passport.authenticate("facebook",{successRedirect:'/home',failureRedirect:'/auth/failure'}))

//otp
userRoute.get("/sendOtp",otpController.getOtp)
userRoute.post("/sendOtp",otpController.getOtp)
userRoute.post("/verifyotp",otpController.otpCheck)

userRoute.get("/resend",otpController.getOtp)

userRoute.get("/get-remaining-time",otpController.getOTPTime)


//home
userRoute.get("/shop",aut.requirelogin,aut.isBlocked,homeController.loadHome)
userRoute.get("/single-product",aut.requirelogin,aut.isBlocked,homeController.singleproductLoad)
//home filter

userRoute.get("/search",aut.requirelogin,aut.isBlocked,searchController.searchProduct)
userRoute.post("/search",aut.requirelogin,aut.isBlocked,searchController.searchProduct)
//profile
userRoute.get("/profile",aut.requirelogin,aut.isBlocked,profileController.profileLogin)
userRoute.post("/updateAddress",aut.requirelogin,aut.isBlocked,profileController.verifyadressLogin)
userRoute.post("/saveAddress",aut.requirelogin,aut.isBlocked,adressController.checkOutSaveAdress)
userRoute.get("/adressEdit",aut.requirelogin,aut.isBlocked,profileController.profileEditLoad)
userRoute.post("/updateUser",aut.requirelogin,aut.isBlocked,profileController.profileEdit)
userRoute.get("/editAdressLoad",aut.requirelogin,aut.isBlocked,adressController.addressEditLoad)
userRoute.post("/editAddress",aut.requirelogin,aut.isBlocked,adressController.addressEdit)
userRoute.get("/deleteAdress",aut.requirelogin,aut.isBlocked,adressController.adressDelete)
userRoute.patch("/submitReturn",aut.requirelogin,aut.isBlocked,profileController.submitReuturn)
userRoute.get("/orderView",aut.requirelogin,aut.isBlocked,orderController.orderView)
userRoute.patch("/cancelOrder",aut.requirelogin,aut.isBlocked,orderController.orderCancel)
userRoute.post("/changepassword", aut.requirelogin, aut.isBlocked,profileController.changePasswordHandler);
userRoute.get("/invoice",aut.requirelogin,aut.isBlocked,orderController.invoice)

//cart
userRoute.get("/cart",aut.requirelogin,aut.isBlocked,cartcontroller.loadCart)
userRoute.post("/saveCart",aut.requirelogin,aut.isBlocked,cartcontroller.addCart)
userRoute.post("/WishListsaveCart",aut.requirelogin,aut.isBlocked,cartcontroller.wishListAddCart)
userRoute.get("/delete",aut.requirelogin,aut.isBlocked,cartcontroller.deleteCart)
userRoute.post("/updateQuantity",aut.requirelogin,aut.isBlocked,cartcontroller.editQuantity)



//checkout
userRoute.get("/checkoutLoad",aut.requirelogin,aut.isBlocked,checkoutController.checkOutLoad)
userRoute.post("/applyCoupon",aut.requirelogin,aut.isBlocked,checkoutController.couponApply)
userRoute.post("/removeCoupon",aut.requirelogin,aut.isBlocked,checkoutController.removeCoupon)



//payment
userRoute.get("/payment",aut.requirelogin,aut.isBlocked,paymentController.payment)
userRoute.post("/ordersucess",aut.requirelogin,aut.isBlocked,orderController.orderSucess)
userRoute.get("/ordersucess",aut.requirelogin,aut.isBlocked,orderController.orderComplete)
userRoute.post("/createOrder",aut.requirelogin,aut.isBlocked,paymentController.payOnline )
userRoute.get("/orderedOnline",aut.requirelogin,aut.isBlocked,orderController.onlineOrder)
userRoute.post("/saveFailedOrder",aut.requirelogin,aut.isBlocked,paymentController.saveFailOrder)
userRoute.post("/retryPayment",aut.requirelogin,aut.isBlocked,retryPaymentController.retryFailedOrder)

//wishlist
userRoute.get("/wishlistLoad",aut.requirelogin,aut.isBlocked,wishListControler.wishListLoad)
userRoute.post("/wishlist",aut.requirelogin,aut.isBlocked,wishListControler.Addwishlist)
userRoute.get("/Deletewishlist",aut.requirelogin,aut.isBlocked,wishListControler.deletewishlist)








module.exports=userRoute