import mongoose from "mongoose";
import Users from "../models/user.js";
import Category from "../models/category.js";
import News from "../models/news.js";
import Comment from "../models/comment.js";
import createError from "../utils/error.message.js";
import paginate from "../utils/paginate.js";

export const index = async (req,res,next) => {
    try {
        const news = await paginate(News,{},req.query,{populate: [
            {path: "category", select: "name slug"},
            {path: "author", select: "fullname"}
        ]});

        res.status(200).render("index", {news, query: req.query});
    } catch (error) {
        next(createError(error,error.code));
    }
}

export const articalByCategories = async (req,res,next) => {
    try {
        const category = await Category.findOne({slug: req.params.slug});

        if (!category){
            return next(createError("Category Not Found", 404));
        }
        
        const news = await paginate(News,{category: category._id},req.query,{populate: [
            {path: "category", select: "name slug"},
            {path: "author", select: "fullname"}
        ]});

        res.status(200).render("category", {news, categoryName: category.name, query: req.query});
    } catch (error) {
        next(createError(error,error.code));
    }
}

export const singleArticle = async (req,res,next) => {
    try {
        const articleId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(articleId)){
            return next(createError("Invalid Author ID", 400));
        }

        const singleNews = await News.findOne({_id: articleId}).populate("author","fullname").populate("category",{name: 1, slug: 1});
        const comments = await Comment.find({article: articleId, status: "approved"}).sort("-createdAt");
        if (!singleNews){
            return next(createError("Article Not Found",404));
        }

        res.status(200).render("single", {singleNews,comments, query: req.query});
    } catch (error) {
        next(createError(error,error.code));
    }
}

export const search = async(req,res,next) => {
    try {
        const search = req.query.search || "";

        const news = await paginate(News,{
            $or:[
                {title: {$regex: search, $options: "i"}},
                {content: {$regex: search, $options: "i"}}
            ]
        },req.query,{populate: [
            {path: "category", select: "name slug"},
            {path: "author", select: "fullname"}
        ]});

        if (news.length === 0){
            return next(createError("No Results Found", 404));
        }

        res.status(200).render("search", {news, searchTerm: search, query: req.query});
    } catch (error) {
        next(createError(error,error.code));
    }
}

export const author = async(req,res,next) => {
    try {
        const authorId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(authorId)){
            return next(createError("Invalid Author ID", 400));
        }

        const author = await Users.findOne({_id: authorId});

        if (!author){
            return next(createError("Author Not Found", 404));
        }

        const news = await paginate(News,{author: authorId},req.query,{populate: [
            {path: "category", select: "name slug"},
            {path: "author", select: "fullname"}
        ]});

        res.status(200).render("auther", {news, authorName: author.fullname, query: req.query});
    } catch (error) {
         next(createError(error,error.code));
    }
}

export const addComment = async (req,res,next) => {
    try {
        const {name, email, content} = req.body;
        console.log(name);
        const articleId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(articleId)){
            return next(createError("Invalid Article ID", 400));
        }

        const check = await News.findById(articleId);

        if (!check){
            return next(createError("Article does not Found", 404));
        }

        await Comment.create({article: articleId, name, email, content});

        res.status(201).redirect(`/single/${articleId}`);
    } catch (error) {
         next(createError(error,error.code));
    }
}

export const testing = async (req,res) => {
    const news = await News.find();
    res.status(200).json(news);
}