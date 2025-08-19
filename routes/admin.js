import express from "express";
import * as authController from "../controller/auth.controller.js";
import * as userController from "../controller/user.controller.js";
import * as categoryController from "../controller/category.controller.js";
import * as articleController from "../controller/article.controller.js";
import * as commentController from "../controller/comment.controller.js";
import checkLogin from "../middleware/isLogin.js";
import isAdmin from "../middleware/isadmin.js";
import uploader from "../middleware/multer.js";
import * as validator from "../middleware/validation.js";
import loadCommonData from "../middleware/load.common.data.js";

const router = express.Router();

router.use(loadCommonData);

//Login Routes
router.get("/",authController.loginPage);
router.post("/index",validator.loginValidation,validator.handler("admin/login", false),authController.adminLogin);
router.get("/logout",authController.logout);
router.get("/dashboard",checkLogin,authController.dashboard);
router.get("/settings",checkLogin,isAdmin, authController.settings);
router.post("/save-settings",checkLogin,isAdmin,uploader.single("website_logo"),authController.saveSettings);

//User CRUD Routes
router.get("/users",checkLogin,isAdmin, userController.allUsers);
router.get("/add-user",checkLogin,isAdmin,userController.addUserPage);
router.post("/add-user",checkLogin,isAdmin,validator.userAddValidation , validator.handler("admin/users/create"), userController.addUser);
router.get("/update-user/:id",checkLogin,isAdmin,userController.updateUserPage);
router.post("/update-user/:id",checkLogin,isAdmin,validator.userUpdateValidation,validator.handler("admin/users/update"),userController.updateUser);
router.delete("/delete-user/:id",checkLogin,isAdmin,userController.deleteUser);

//Category CRUD Routes
router.get("/category",checkLogin, isAdmin,categoryController.allCategory);
router.get("/add-category",checkLogin,isAdmin,categoryController.addCategoryPage);
router.post("/add-category", checkLogin,isAdmin,validator.categoryAddValidation,validator.handler("admin/categories/create"),categoryController.addCategory);
router.get("/update-category/:id",checkLogin,isAdmin,categoryController.updateCategoryPage);
router.post("/update-category/:id",checkLogin,isAdmin,validator.categoryUpdateValidation,validator.handler("admin/categories/update"),categoryController.updateCategory);
router.delete("/delete-category/:id",checkLogin,isAdmin,categoryController.deleteCategory);

//Article CRUD Routes
router.get("/article", checkLogin,articleController.allArticle);
router.get("/add-article",checkLogin,articleController.addArticlePage);
router.post("/add-article",checkLogin,uploader.single("image"), validator.articleValidation, validator.handler("admin/articles/create"), articleController.addArticle);
router.get("/update-article/:id",checkLogin,articleController.updateArticlePage);
router.post("/update-article/:id",checkLogin,uploader.single("image"),validator.articleValidation,validator.handler("admin/articles/update"),articleController.updateArticle);
router.delete("/delete-article/:id",checkLogin,articleController.deleteArticle);

//Comment Routes
router.get("/comments",checkLogin,commentController.allComments);
router.put("/update-comment-status/:id",checkLogin,commentController.updateCommentStatus);
router.delete("/delete-comment/:id",checkLogin,commentController.deleteComment);

//404 Middleware
router.use(checkLogin,(req,res,next)=>{
    res.status(404).render("404",{message: "Page Not Found", status: 404, role: req.role});
});

//500 Middleware
router.use(checkLogin, (error,req,res,next)=>{
    res.status(error.status || 500).render("404",{message: error.message, status: error.status || 500, role: req.role});
});
export default router;