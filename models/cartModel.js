const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        size: {
            type: String,
            required: true
        }
    }],
    subtotal: {
        type: Number,
        default: 0
    },
    isButton: {
        type: Boolean,
        default: false
    },
    coupon: {
        type: String,
        default: "Not Applied"
    },
    couponId: {
        type: String
    },
    discountAmount: {
        type: String,
        default: "0"
    },
    status: {
        type: String
    }
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
