    const express=require("express")
    const adminRoute=express()
     const auth=require("../middleware/auth")
    const path = require("path");
    const multer=require("multer")
    adminRoute.use(express.static("images"))
    const storage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,"./images")
        },
        filename:(req,file,cb)=>{
            cb(null,Date.now()+path.extname(file.originalname))
        }
    })
    const upload=multer({
        storage:storage,
        limits:{
            fileSize:10 * 1024 *1024
        },
        fileFilter:(req,file,cb)=>{
            cb(null,true)
        }
    })
    const session=require("express-session")
    const config=require("../config/config")
    adminRoute.use(session({secret:config.sessionSecret}))

    const bodyparser=require("body-parser")
    adminRoute.use(bodyparser.json())
    adminRoute.use(bodyparser.urlencoded({extended:true}))


    adminRoute.use(express.static(path.join(__dirname, "../public")));
    adminRoute.set("view engine","ejs")
    adminRoute.set("views","./views/admin")

    const admincontroller=require("../controllers/admincontroller")
    adminRoute.get("/",admincontroller.showAdminLogin)  
    adminRoute.post("/login",admincontroller.verifyAdmin)
    adminRoute.get("/home",auth.requireAuth,admincontroller.loadAdminHome)
    adminRoute.get("/logout",admincontroller.logoutAdmin,)
   
    //userlist
    adminRoute.get("/users",auth.requireAuth,admincontroller.listUser)
    adminRoute.put("/users/block",auth.requireAuth,admincontroller.blockUser)
    adminRoute.put("/users/unblock",auth.requireAuth,admincontroller.unblockUser)

    //block &unblck the user

    adminRoute.patch("/unblock/:id",auth.requireAuth,admincontroller.unblockUser)
    adminRoute.patch("/block/:id",auth.requireAuth,admincontroller.blockUser)

    //categories
  
    adminRoute.get("/category",auth.requireAuth,admincontroller.loadCategory)
    adminRoute.post("/uploads",auth.requireAuth,upload.single('image'),admincontroller.addCategory)
    adminRoute.get("/edit-category",auth.requireAuth,admincontroller.editLoadCategory)
    adminRoute.post("/edit-update",auth.requireAuth,upload.single('image'),admincontroller.updateEditCategories)
    adminRoute.patch("/unlist",auth.requireAuth,admincontroller.unlistCategory)
    adminRoute.patch("/list",auth.requireAuth,admincontroller.listCategory)

    //product 

    adminRoute.get("/productslist",auth.requireAuth,admincontroller.loadproductList)
    adminRoute.get("/add-product",auth.requireAuth,admincontroller.loadaddNewProduct)
    adminRoute.post("/addNewproduct",auth.requireAuth,upload.array("images",4),admincontroller.addNewproduct)
    adminRoute.get("/edit-product",admincontroller.editLoadProduct)
    adminRoute.post("/update-product",auth.requireAuth,upload.single('image'),admincontroller.updateproduct)
    adminRoute.patch("/productUnlist",auth.requireAuth,admincontroller.unlistProduct)
    adminRoute.patch("/productlist",auth.requireAuth,admincontroller.listProduct)
  




    adminRoute.get("*",(req,res)=>{
        res.redirect("/admin")
    })


    module.exports=adminRoute