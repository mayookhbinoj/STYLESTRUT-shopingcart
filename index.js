const mongoose=require("mongoose")
const path = require('path')

mongoose.connect("mongodb://localhost:27017/shopingkart")
const express=require("express")
const cookieParser=require("cookie-parser")
const app=express()
const nocache = require("nocache"); 

app.use(express.json());
app.use(cookieParser())
app.use(nocache())

const userRoute=require("./routes/userRoute")


app.use("/",userRoute)


//admin routes
const adminRoute=require("./routes/adminroute")

app.use("/admin",adminRoute)


app.listen(3001,()=>{
    console.log("running in ");
})