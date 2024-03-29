    const mongoose=require("mongoose")
    const otp=new mongoose.Schema({
        user_id:{
            type: mongoose.Schema.Types.ObjectId,
            require:true,
            ref:"User"
        }
        ,
        otp:{
            type:String,
        
        },
        is_verified:{
            type:Boolean    ,
            default:false
        },
        created_at: {
            type: Date,
            default: Date.now,
            expires: 60
        }    
    

    })
    const Otp=mongoose.model("Otp",otp)
    module.exports=Otp 