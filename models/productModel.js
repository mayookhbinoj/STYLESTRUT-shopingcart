
    const mongoose=require("mongoose")
    const product=new mongoose.Schema({
    name:{
            type:String,
            trim:true,
            uppercase:true,
         
        },
        price:{
            type: Number,
         
        },
        sizes: [{
            size: {
                type: String,
                enum: ['L', 'M', 'XL'], 
               
            },
            quantity: {
                type: Number,
                default: 0
            }
        }],
    
        details:{
            type:String,

        },
        brand:{
            type:String
        },
        image:[{
            type:String,
           
        }],
        description:{
            type:String
        },
        isListed: {
            type: Boolean,
            default:false
        },
        discountPercentage: {
            type: Number,
           
        },
        actualPrice:{
            type:Number
        },
        category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category"
            },
            createdAt: {
                type: Date,
                default: Date.now 
            }


    })
    const products=mongoose.model("products",product)
    module.exports=products