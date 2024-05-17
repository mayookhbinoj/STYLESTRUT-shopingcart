const mongoose=require("mongoose")
const adress=new mongoose.Schema({

street:{
    type:String,
    required: true
},
city:{
    type:String,
    required: true
},
state:{
    type:String,
    required: true

},
ZIPCode:{
    type: String, // Change the type to Number
    required: true

},
isDelete: {
    type: Boolean,
    default:false
  },
user:{
    type: mongoose.Schema.Types.ObjectId,
     ref:"users"}
 


})
const Adress=mongoose.model("Adress",adress)
module.exports=Adress



