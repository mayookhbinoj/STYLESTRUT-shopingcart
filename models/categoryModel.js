const mongoose=require("mongoose")
const categoryschema=new mongoose.Schema({

    categoryName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isListed: {
        type: Boolean,
        default: false
      }
})
const category=mongoose.model("category",categoryschema)
module.exports=category