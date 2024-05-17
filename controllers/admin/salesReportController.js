const mongoose = require('mongoose');
const Admin = require("../../models/adminModel");
const User=require("../../models/userModel")
const order=require("../../models/orderModel")
const Wallet=require("../../models/walletModel");
const moment=require("moment")
const { Long } = require('mongodb');



const salesReportLoad=async(req,res)=>{
  try {
    const orders= await order.find({status:"delivered"})
    let orderOriginalPrice = 0
    let orderDiscountPrice = 0
    orders.forEach((order)=>{
       orderOriginalPrice+= parseInt(order.total) 
      
  
       
    })
    const salesCount=await order.find({status:"delivered"}).count()
  
    

    res.render("salesReport",{orders:orders,orderOriginalPrice:orderOriginalPrice,salesCount:salesCount})
  } catch (error) {
    console.log('something Went wrong to load the sales report', error);
    res.status(500).render("error500").send('Internal Server Error');
  }
}
const  salesReportPost = async (req,res)=>{
    try {
      console.log("enter in to sales");
        console.log(req.body);
      const date = req.body.selectedOption
      const startDate = req.body.startDate
      const endDate = req.body.endDate
   
  
      if(date == "month"){
  
  
          try {
            
              const currentDate = moment()
              console.log(currentDate);
             const startOfMonth = currentDate.clone().startOf('month')
             console.log(startOfMonth);
         
             const endOfMonth = currentDate.clone().endOf('month')
              console.log(endOfMonth);
             const startOfMonthFormatted = startOfMonth.format('YYYY-MM-DD');
             console.log(startOfMonthFormatted);
             const endOfMonthFormatted = endOfMonth.format('YYYY-MM-DD');
             console.log(typeof endOfMonthFormatted);
         
             
         
             const orders = await order.find({
                 createdAt: {
                   $gte: startOfMonthFormatted,
                   $lte:endOfMonthFormatted 
                 },status:"delivered"
               });
           console.log("orders",orders);
           let orderOriginalPrice = 0
           let orderDiscountPrice = 0
           orders.forEach((order)=>{
              orderOriginalPrice+= parseInt(order.total) 
             
         
              
           })
         
           const salesCount = await order.countDocuments({
            createdAt: {
              $gte: startOfMonthFormatted,
              $lte:endOfMonthFormatted 
            },status:"delivered"
          })
           totalDiscount = orderOriginalPrice - orderDiscountPrice
         
         console.log(orders,"orders");
         
           
          res.render('salesReport',{orders:orders,orderOriginalPrice:orderOriginalPrice,orderDiscountPrice:orderDiscountPrice,totalDiscount:totalDiscount,salesCount:salesCount})
          } catch (error) {
            console.log('something Went wrong to load the month', error);
             res.status(500).render("error500").send('Internal Server Error');
          }
       
      }
      
     
      if(date =="day"){
  
          const currentDate = moment();
          const startOfDay = currentDate.clone().startOf('day');
          const endOfDay = currentDate.clone().endOf('day');
          
          const startOfDayFormatted = startOfDay.toDate();
          const endOfDayFormatted = endOfDay.toDate();
          
         
          
          const orders = await order.find({
            createdAt: {
              $gte: startOfDayFormatted, // Greater than or equal to the start of the day
              $lt: endOfDayFormatted     // Less than the end of the day
            },status:"delivered"
          });
          let orderOriginalPrice = 0
          let orderDiscountPrice = 0
          orders.forEach((order)=>{
             orderOriginalPrice+= parseInt(order.total) 
            
        
             
          })
          const salesCount = await order.find({
            createdAt: {
              $gte: startOfDayFormatted, // Greater than or equal to the start of the day
              $lt: endOfDayFormatted     // Less than the end of the day
            },status:"delivered"
          }).count();
        
       
        
          totalDiscount = orderOriginalPrice - orderDiscountPrice
      
       console.log(orderOriginalPrice,"priceee");
       res.render('salesReport',{orders:orders,orderOriginalPrice:orderOriginalPrice,orderDiscountPrice:orderDiscountPrice,totalDiscount:totalDiscount,salesCount:salesCount})
      }
  
      if(date =="weak"){
          const currentDate = moment()
          const startOfWeek = currentDate.clone().startOf('week');
       
          const endOfWeek = currentDate.clone().endOf('week');
          
          const startOfWeekFormatted = startOfWeek.format('YYYY-MM-DD');
          const endOfWeekFormatted = endOfWeek.format('YYYY-MM-DD');
          console.log(startOfWeekFormatted);
         
          
          const orders = await order.find({
            createdAt: {
              $gte: startOfWeekFormatted, // Greater than or equal to the start date of the week
              $lte: endOfWeekFormatted    // Less than or equal to the end date of the week
            },status:"delivered"
          });
      
          let orderOriginalPrice = 0
          let orderDiscountPrice = 0
          orders.forEach((order)=>{
             orderOriginalPrice+= parseInt(order.total) 
            
        
             
          })
          const salesCount = await order.countDocuments({
            createdAt: {
              $gte: startOfWeekFormatted,
              $lte: endOfWeekFormatted
            },
            status: "delivered"
          });
          
          console.log("Total number of sales:", salesCount);
          totalDiscount = orderOriginalPrice - orderDiscountPrice
     
        console.log("total",totalDiscount);
        
       res.render('salesReport',{orders:orders,orderOriginalPrice:orderOriginalPrice,orderDiscountPrice:orderDiscountPrice,totalDiscount:totalDiscount,salesCount:salesCount})
      }
    
  
         if(date == "year"){
         const currentDate = moment(); // Get the current date
          const startOfYear = currentDate.clone().startOf('year'); // Get the start of the current year
          const endOfYear = currentDate.clone().endOf('year'); // Get the end of the current year
  
          const startOfYearFormatted = startOfYear.format('YYYY-MM-DD'); // Format start of year
          const endOfYearFormatted = endOfYear.format('YYYY-MM-DD'); // Format end of year
  
        
          const orders = await order.find({
          createdAt: {
              $gte: startOfYearFormatted, // Greater than or equal to the start date of the year
              $lte: endOfYearFormatted    // Less than or equal to the end date of the year
          },status:"delivered"
          });
          
          let orderOriginalPrice = 0
          let orderDiscountPrice = 0
          orders.forEach((order)=>{
             orderOriginalPrice+= parseInt(order.total) 
            
        
             
          })
          const salesCount = await order.countDocuments({
            createdAt: {
                $gte: startOfYearFormatted, 
                $lte: endOfYearFormatted    
            },status:"delivered"
            })
        
          totalDiscount = orderOriginalPrice - orderDiscountPrice
              res.render('salesReport',{orders:orders,orderOriginalPrice:orderOriginalPrice,orderDiscountPrice:orderDiscountPrice,totalDiscount:totalDiscount,salesCount:salesCount})
          }
  
      if(startDate !==""){
           const startdate = startDate
           const enddate = endDate
          
           
           const orders = await order.find({
              createdAt: {
                  $gte: startdate, 
                  $lte: enddate    
              },status:"delivered"
              });
              
              let orderOriginalPrice = 0
              let orderDiscountPrice = 0
              orders.forEach((order)=>{
                 orderOriginalPrice+= parseInt(order.total) 
                
            
                 
              })
              const salesCount = await order.countDocuments({
                createdAt: {
                    $gte: startdate, 
                    $lte: enddate    
                },status:"delivered"
                })
            
              totalDiscount = orderOriginalPrice - orderDiscountPrice
  
              
              res.render('salesReport',{orders:orders,orderOriginalPrice:orderOriginalPrice,orderDiscountPrice:orderDiscountPrice,salesCount:salesCount})
      }
  
  }
     catch (error) {
      console.log(error);
      const errorMessage = "Internal Server Error";
      console.log('something Went wrong to load the salesreport', errorMessage);
        res.status(500).render("error500").send('Internal Server Error');
    }
  }
module.exports={
    salesReportLoad,
    salesReportPost
}