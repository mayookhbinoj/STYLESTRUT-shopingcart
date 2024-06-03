const mongoose=require("mongoose")
const walletSchema = new mongoose.Schema({
  userId:{
      type: String,
      
  },
  refund:[{
    productName:{
          type:String,

      },
      amount:{
          type:String,
      },status:{
        type:String,
    
      },
      

  }],
  
  totalAmount:{
      type:Number,
      default:0
    }
    
});
const Wallet = mongoose.model("wallet", walletSchema);

module.exports = Wallet;