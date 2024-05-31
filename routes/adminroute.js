const express = require("express");
const adminRoute = express();
const auth = require("../middleware/auth");
const path = require("path");
const multer = require("multer");
adminRoute.use(express.static("images"));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});
const session = require("express-session");
const config = require("../config/config");
adminRoute.use(session({ secret: config.sessionSecret }));

const bodyparser = require("body-parser");
adminRoute.use(bodyparser.json());
adminRoute.use(bodyparser.urlencoded({ extended: true }));

adminRoute.use(express.static(path.join(__dirname, "../public")));
adminRoute.set("view engine", "ejs");
adminRoute.set("views", "./views/admin");

const admincontroller = require("../controllers/admin/admincontroller");
const categoryController = require("../controllers/admin/categoryController");
const productController = require("../controllers/admin/productController");
const orderController = require("../controllers/admin/orderController");
const couponController = require("../controllers/admin/couponController");
const offerController = require("../controllers/admin/offerController");
const salesReportController = require("../controllers/admin/salesReportController");
const categoryOfferControllerr = require("../controllers/admin/categoryOfferController");

//home
adminRoute.get("/",auth.isAdminLoggedin,admincontroller.showAdminLogin);
adminRoute.post("/login",auth.isAdminLoggedin, admincontroller.verifyAdmin);
adminRoute.get("/home", auth.requireAuth, admincontroller.loadAdminHome);
adminRoute.get("/logout", admincontroller.logoutAdmin);


//userlist
adminRoute.get("/users", auth.requireAuth, admincontroller.listUser);
adminRoute.put("/users/block", auth.requireAuth, admincontroller.blockUser);
adminRoute.put("/users/unblock", auth.requireAuth, admincontroller.unblockUser);

//block &unblck the user

adminRoute.patch("/unblock/:id", auth.requireAuth, admincontroller.unblockUser);
adminRoute.patch("/block/:id", auth.requireAuth, admincontroller.blockUser);

//categories

adminRoute.get("/category", auth.requireAuth, categoryController.loadCategory);
adminRoute.post(
  "/uploads",
  auth.requireAuth,
  upload.single("image"),
  categoryController.addCategory
);
adminRoute.get(
  "/edit-category",
  auth.requireAuth,
  categoryController.editLoadCategory
);
adminRoute.post(
  "/edit-update",
  auth.requireAuth,
  upload.single("image"),
  categoryController.updateEditCategories
);
adminRoute.patch(
  "/unlist",
  auth.requireAuth,
  categoryController.unlistCategory
);
adminRoute.patch("/list", auth.requireAuth, categoryController.listCategory);

//product

adminRoute.get(
  "/productslist",
  auth.requireAuth,
  productController.loadProductList
);
adminRoute.get(
  "/add-product",
  auth.requireAuth,
  productController.loadAddNewProduct
);
adminRoute.post(
  "/addNewproduct",
  auth.requireAuth,
  upload.array("images", 4),
  productController.addNewproduct
);
adminRoute.get(
  "/edit-product",
  auth.requireAuth,
  productController.editLoadProduct
);
adminRoute.post(
  "/update-product",
  auth.requireAuth,
  upload.array("image", 4),
  productController.updateProduct
);
adminRoute.patch(
  "/productUnlist",
  auth.requireAuth,
  productController.unlistProduct
);
adminRoute.patch(
  "/productlist",
  auth.requireAuth,
  productController.listProduct
);

//orders
adminRoute.get("/orderList", auth.requireAuth, orderController.orderListLoad);
adminRoute.patch("/cancelOrder", auth.requireAuth, orderController.cancelOrder);
adminRoute.post(
  "/changeStatus",
  auth.requireAuth,
  orderController.changeStatusOrders
);
adminRoute.get("/orderView", auth.requireAuth, orderController.orderView);

//sales report
adminRoute.get(
  "/salesReport",
  auth.requireAuth,
  salesReportController.salesReportLoad
);
adminRoute.post(
  "/day-sales",
  auth.requireAuth,
  salesReportController.salesReportPost
);

//coupon
adminRoute.get("/coupon", auth.requireAuth, couponController.couponLoad);
adminRoute.get("/addCoupon", auth.requireAuth, couponController.addcouponLoad);
adminRoute.post("/addCoupon", auth.requireAuth, couponController.postcoupon);
adminRoute.delete(
  "/CouponDelete",
  auth.requireAuth,
  couponController.couponDelte
);

//offer
adminRoute.get("/offer", auth.requireAuth, offerController.offerLoad);
adminRoute.get(
  "/addProductoffer",
  auth.requireAuth,
  offerController.productOfferLoad
);
adminRoute.post("/addOffer", auth.requireAuth, offerController.addProductOffer);
adminRoute.get(
  "/addCategoryOffer",
  auth.requireAuth,
  categoryOfferControllerr.categoryOfferLoad
);
adminRoute.post(
  "/updateCategoryOffer",
  auth.requireAuth,
  categoryOfferControllerr.addCateogryOffer
);

adminRoute.get("*", (req, res) => {
  res.redirect("/admin");
});

module.exports = adminRoute;
 