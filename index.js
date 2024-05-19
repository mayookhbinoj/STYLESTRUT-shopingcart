const mongoose=require("mongoose")
const path = require('path')
require('dotenv').config()

const mongodbURI = process.env.MONGODB_URI; 

console.log(mongodbURI);
mongoose.connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})

.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
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



app.listen(3002,()=>{
    console.log("running in ");
})