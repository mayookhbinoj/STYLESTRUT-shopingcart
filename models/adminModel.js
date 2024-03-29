const mongoose=require("mongoose")
const employee=new mongoose.Schema({
    
     email:{
        type:String,
        required:true,
        unique: true
     },
     phone:{
        type:Number,
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
     is_admin:{
      type:Number,
      required:true
  }
  
     

})

const Employee=mongoose.model("admin",employee)
module.exports=Employee