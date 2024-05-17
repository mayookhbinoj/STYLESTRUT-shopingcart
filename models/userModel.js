const mongoose=require("mongoose")
const user=new mongoose.Schema({
    
     email:{
        type:String,
        required:true,
        unique: true
     },
     phone:{
        type:String,
       required:true
     },
     password:{
        type:String,
        required:true
     },

     is_varified:{
      type:Number,
      default:0
     },
     blocked: {
      type: Boolean,
      default: false
        },
      name: {
   type: String,
    required: true
},
googleId:{
   type:String,

},
image:{
 
 
},
coupon: {
   type: [String] 
},
referralCode:{
   type:String
}


})

const User=mongoose.model("User",user)
module.exports=User