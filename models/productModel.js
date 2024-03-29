
const mongoose=require("mongoose")
const product=new mongoose.Schema({
  name:{
        type:String,
        trim:true,
        uppercase:true,
        required: true,
    },
    price:{
        type: Number,
        required: true
    },
    
    stock:{
        type: Number,
        required: true,
        min: 0
    },
    details:{
        type:String,

    },
    brand:{
        type:String
    },
    image:[{
         type:String,
         required:true
     }],
    description:{
        type:String
    },
    isListed: {
        type: Boolean,
        default:false
      },
    category:{
    type: mongoose.Schema.Types.ObjectId,
     ref:"Category"
        }
 

})
const products=mongoose.model("products",product)
module.exports=products