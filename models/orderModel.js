    const mongoose = require('mongoose');


    const orderSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        addressId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        paymentMethod: {
            type: String,
        
        },
        createdAt: {
            type: Date,
            default: Date.now
        },

    total:{
        type:String
    },
    cancel: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: [ 'Processing', 'Shipped', 'Delivered','cancel',"payment failed"], 
        default: 'Shipped'
    },
    cartItems:{
        type:Array
    },
    discountAmount: { type:String, default: "0" }


    })


    const Order = mongoose.model('Order', orderSchema);

    module.exports = Order;
