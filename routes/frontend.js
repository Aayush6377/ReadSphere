import express from "express";
import * as controller from "../controller/frontend.controller.js";
import loadCommonData from "../middleware/load.common.data.js";

const router = express.Router();

router.use(loadCommonData);

router.get("/",controller.index);

router.get("/category/:slug",controller.articalByCategories);

router.get("/single/:id", controller.singleArticle);

router.get("/search", controller.search);

router.get("/author/:id", controller.author);

router.post("/single/:id/comment",controller.addComment);

router.get("/testing",controller.testing);

router.use((error,req,res,next)=>{
    res.status(error.status || 500).render("404",{message: error.message, status: error.status || 500});
});

router.use((req,res,next)=>{
    res.status(404).render("404",{message: "Page Not Found", status: 404, role: req.role});
});

export default router;