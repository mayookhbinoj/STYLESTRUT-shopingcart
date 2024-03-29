const mongoose=require("mongoose")
const employee=new mongoose.Schema({
    
     email:{
        type:String,
        required:true,
        unique: true
     },
     phone:{
        type:Number,
      //   required:true
     },
     password:{
        type:String,
      //   required:true
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
   // required: true
},
googleId:{
   type:String,

}



})

const Employee=mongoose.model("User",employee)
module.exports=Employee