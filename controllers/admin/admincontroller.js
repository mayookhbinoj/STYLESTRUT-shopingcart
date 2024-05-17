const mongoose = require('mongoose');
const Admin = require("../../models/adminModel");
const User=require("../../models/userModel")
const products=require("../../models/productModel")
const category=require("../../models/categoryModel");
const order=require("../../models/orderModel")
const coupon=require("../../models/couponModel")
const jwt=require("jsonwebtoken")


 const createToken = (admin)=>{
        const JWT_SECRET = process.env.JWT_SECRET
        return jwt.sign(admin,JWT_SECRET,{expiresIn:"1h"})

}


const showAdminLogin = (req, res) => {
   try {
    res.render("login")
   } catch (error) {
    console.log(error);
   }
};



    const verifyAdmin=async(req,res)=>{
        

        try {
            const email=req.body.email
            const password=req.body.password
            const admin = await Admin.findOne({email:email });
            console.log("Email:", email);
            console.log(admin);
            if (!admin) {
                return res.render("login", {messege: "Email and password is incorect" });
            }
            if(password === admin.password){
                // req.session.user_id=admin._id
                const token = createToken({id:admin._id})
                console.log(token);
                res.cookie("admin",token,{httpOnly:true,maxAge:60*60*1000})

                res.redirect("/admin/home")
                
            }
            else{
                console.log("wrong");
                res.render("login",{messege:"Email and password is incorect"})
            }

        
        } catch (error) {
            console.log('Error verifying Admin:', error);
            res.status(500).render("error500").send('Internal Server Error');
            
        }
    }
const loadAdminHome=async(req,res)=>{
    try {
        console.log("enter in to the admin home")
        const mostUsedProduct = await order.aggregate([
            { $unwind: "$cartItems" },
            { 
            $group: { 
                    _id: "$cartItems.product.name",
                    image: { $first: "$cartItems.product.image" },
                    price: { $first: "$cartItems.product.price" },
                    details: { $first: "$cartItems.product.details" },
                    totalQuantity: { $sum: "$cartItems.quantity" }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 }
        ]);
        const mostUsedCategory = await order.aggregate([
            { $unwind: "$cartItems" },
            {
                $lookup: {
                    from: "products", 
                    localField: "cartItems.product._id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $group: {
                    _id: "$productDetails.category", 
                    totalQuantity: { $sum: "$cartItems.quantity" }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "categories", 
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            { $unwind: "$categoryDetails" },
            {
                $project: {
                    _id: "$categoryDetails._id",
                    name: "$categoryDetails.categoryName",
                    image: "$categoryDetails.image",
                    totalQuantity: 1
                }
            }
        ]);

     
   
        const monthlySalesData = await order.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" }, 
                    totalSales: { $sum: { $toDouble: "$total" } } 
                }
            },
            {
                $sort: { "_id": 1 } 
            }
        ]);

       
        const monthlySalesLabels = [];
        const monthlySales = [];
        monthlySalesData.forEach(month => {
            const monthName = new Date(2000, month._id - 1).toLocaleString('default', { month: 'short' });
            monthlySalesLabels.push(monthName);
            monthlySales.push(month.totalSales.toFixed(2));
        });

      
        const yearlySalesData = await order.aggregate([
            {
                $group: {
                    _id: { $year: "$createdAt" }, 
                    totalSales: { $sum: { $toDouble: "$total" } } 
                }
            },
            {
                $sort: { "_id": 1 } 
            }
        ]);

       
        const yearlySalesLabels = [];
        const yearlySales = [];
        yearlySalesData.forEach(year => {
            yearlySalesLabels.push(year._id);
            yearlySales.push(year.totalSales.toFixed(2));
        });
        console.log("1",yearlySalesData,"2",yearlySales);

      
  console.log("fsfas",mostUsedProduct)
        res.render("home",{mostUsedProduct:mostUsedProduct,mostUsedCategory:mostUsedCategory,monthlySalesLabels, monthlySalesData, yearlySalesData, yearlySales})
    } catch (error) {
        console.log(error);
        
    }
}
const logoutAdmin=async(req,res)=>{
    try {
       
        res.clearCookie("admin")
        res.redirect("/admin")
    } catch (error) {
        console.log('Failed to logout:', error);
        res.status(500).render("error500").send('Internal Server Error');
        
    }
}
const listUser=async(req,res)=>{
   try {
  const userData=await User.find({is_varified:0})
  console.log("hi  "+userData);
  res.render("userlist",{users:userData})
  console.log('userdata',userData);
    
   } catch (error) {
    console.log('something Went wrong list the user:', error);
    res.status(500).render("error500").send('Internal Server Error');
   }
}
const blockUser=async(req,res)=>{
    
    try {
        const id=req.params.id
        console.log(id);
      const user=  await User.findByIdAndUpdate(id,{blocked:true})
        console.log(user);
        res.sendStatus(200).send('User has been blocked. Please contact the admin for further assistance.');

    } catch (error) {
        console.log('something Went wrong to block the user', error);
        res.status(500).render("error500").send('Internal Server Error');
    }
}
const unblockUser=async(req,res)=>{
    try {
         const id=req.params.id
         console.log(id);
        await User.findByIdAndUpdate(id,{blocked:false})
        res.sendStatus(200)
     
    } catch (error) {
        console.log('something Went wrong to unblock the user', error);
        res.status(500).render("error500").send('Internal Server Error');
      
    }
}
const chartTable=async(req,res)=>{
    try {
        console.log("enter in to chart table")
        const interval = req.params.interval;
        let startDate, endDate;
        console.log("fsakfbjasjfjbakjs",interval)
        if (interval === 'yearly') {
            startDate = new Date(new Date().getFullYear(), 0, 1); 
            endDate = new Date(new Date().getFullYear(), 11, 31); 
          } else if (interval === 'monthly') {
            startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1); 
            endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0); 
          } else {
           
            return res.status(400).json({ error: 'Invalid interval' });
          }
          const data = await ChartData.find({
            date: { $gte: startDate, $lte: endDate },
          });
          res.render("home",{data:data})

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    showAdminLogin,
    verifyAdmin,
     loadAdminHome,
     logoutAdmin,
     listUser,
     blockUser,
     unblockUser,
     chartTable
    
};