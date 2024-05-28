const mongoose = require('mongoose');
const Admin = require("../../models/adminModel");
const User=require("../../models/userModel")
const order=require("../../models/orderModel")
const Wallet=require("../../models/walletModel")
const adress=require("../../models/addressModel")

const orderListLoad=async(req,res)=>{
    try {
        const orders = await order.find({ __v: 0 }).sort({createdAt:-1})
        console.log("orders",orders)
        const Data=await order.find({__v:0}).sort({createdAt:-1})
         const addressDetails = await adress.findOne({ _id: Data[0].addressId, isDelete: false })
         const addressIds = orders.map(order => order.addressId);
         const addressPromises = addressIds.map(addressId =>
            adress.findOne({ _id: addressId, isDelete: false })
        );
        const addresses = await Promise.all(addressPromises);
        const dataWithAddresses = orders.map((order, index) => ({
            ...order.toObject(), 
            address: addresses[index] || null 
        }));

        res.render("ordersList",{ Data: dataWithAddresses})

    } catch (error) {
        console.log('something Went wrong to load the orderlist', error);
        res.status(500).render("error500").send('Internal Server Error');
    }
}

const cancelOrder=async(req,res)=>{
    try {
        const id=req.query.id
        console.log(id);
        const cancelOrder=await order.findOneAndUpdate({_id:id},{cancel:true,status: 'cancel'},{new:true})
        res.json({success:"the order has been cancel"})
        console.log(cancelOrder);
       
    } catch (error) {
        console.log('something Went wrong to cancel the order', error);
        res.status(500).render("error500").send('Internal Server Error');
    }
}
const changeStatusOrders = async (req, res) => {
    try {
        const orderId = req.body.orderId;
        const option = req.body.selectedOption;
        
        const orders = await order.findByIdAndUpdate(orderId, { status: option });
        
        if (orders.status === "Requested for return") {
            console.log("requested for return enter");
            const userId = orders.userId;
            console.log(userId, "userid");
            
            for (const product of orders.cartItems) {
                let wallet = await Wallet.findOne({ userId: userId });
                if (!wallet) {
                    wallet = new Wallet({ userId: userId });
                }
                wallet.refund.push({
                    productName: product.product.name,
                    amount: orders.total
                });
                
                wallet.totalAmount += parseInt(orders.total);
                console.log(wallet.totalAmount);
                
                await wallet.save();
            }
            
            res.status(200).json({ redirect: '/admin/orderList?id=' + orderId });
        } else {
            console.log("orderData", orders);
            res.status(200).json({ redirect: '/admin/orderList?id=' + orderId });
        }
    } catch (error) {
        console.log('Something went wrong to change the status order', error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const orderView=async(req,res)=>{
    try {
        console.log("enter in to orderviewof admin")
       
        const id = req.query.id;
        console.log(id);
        const Order = await order.findOne({_id:id});
         const AdressId= Order.addressId
        const Adresss=await adress.findOne({_id:AdressId})
        console.log("fsfa",Adresss);
         console.log("order",Order,);
        console.log(Order.cancel,"ordercancel");
        res.render("orderViewAdmin",{Order:Order,Adresss:Adresss})
    } catch (error) {
        console.log('Something went wrong canot enter in to order view', error);
        res.status(500).json({ error: "Internal server error" });
        
    }
}


   module.exports={
    orderListLoad,
    cancelOrder,
    changeStatusOrders,
    orderView
   }