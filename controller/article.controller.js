import News from "../models/news.js";
import Category from "../models/category.js";
import Comment from "../models/comment.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import createError from "../utils/error.message.js";
import { uploadToCloudinary, deleteImageFromCloudinary } from "../middleware/multer.js";

export const allArticle = async (req,res,next) => {
    try {
        const userId = req.id;
        const role = req.role;
        let articles;
        if (role === "admin") {
            articles = await News.find().populate("author","fullname").populate("category","name");
        } else {
            articles = await News.find({author: userId}).populate("author","fullname").populate("category","name");
        }
        res.status(200).render("admin/articles",{role, articles});
    } catch (error) {
        next(createError(error.message));
    }
}

export const addArticlePage = async (req,res) => {
    const categories = await Category.find();
    res.status(200).render("admin/articles/create",{role: req.role, categories});
}

export const addArticle = async (req,res,next) => {
    try {
        const {title, content, category} = req.body;
        let imageUrl = "https://www.achievershunt.com/public/uploads/course-banner/placeholder/placeholder.png";

        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer, "articles");
        }

        const newArticle = new News({
            title,
            content,
            category,
            author: req.id,
            image: imageUrl
        });
        await newArticle.save();
        res.status(200).redirect("/admin/article");
    } catch (error) {
        next(createError(error.message));
    }
}



export const updateArticlePage = async (req,res,next) => {
    try {
        const articleId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(articleId)){
            return next(createError("Invalid Article ID", 400)); 
        }
        
        const categories = await Category.find();
        const article = await News.findById(articleId);
        if (!article){
            return next(createError("Article Not Found", 404));
        }

        if (req.role === "author"){
            if (req.id.toString() !== article.author.toString()){
                return next(createError("Unauthorized user", 401));
            }
        }
        res.status(200).render("admin/articles/update",{role: req.role,article, categories});
    } catch (error) {
        next(createError(error.message));
    }
}

export const updateArticle = async (req,res,next) => {
    try {
        const articleId = req.params.id;
        const article = await News.findById(articleId);
        if (!article) return next(createError("Article Not Found", 404));

        if (req.role === "author" && req.id.toString() !== article.author.toString()) {
            return next(createError("Unauthorized user", 401));
        }

        const {title, content, category} = req.body;
        let imageUrl = article.image;

        if (req.file) {
            if (imageUrl && !imageUrl.includes("default_article.png")) {
                await deleteImageFromCloudinary(imageUrl);
            }
            imageUrl = await uploadToCloudinary(req.file.buffer, "articles");
        }
        
        await News.findByIdAndUpdate(articleId, { title, content, category, image: imageUrl }, { new: true });
        res.status(200).redirect("/admin/article");
    } catch (error) {
        next(createError(error.message));
    }
}


export const deleteArticle = async (req,res,next) => {
    try {
        const articleId = req.params.id;
        const article = await News.findById(articleId);

        if (!article){
            return next(createError("Invalid Article ID", 400)); 
        }
        if (req.role === "author"){
            if (req.id.toString() !== article.author.toString()){
               return next(createError("Unauthorized user", 401));
            }
        }

        const image = article.image;

        if (image !== "../images/default_article.png"){
            deleteImageFromCloudinary(image);
        }

        const comments = await Comment.deleteMany({article: articleId});
        await News.findByIdAndDelete(articleId);
        res.status(200).json({success: true});
    } catch (error) {
        next(createError(error.message));
    }
}

