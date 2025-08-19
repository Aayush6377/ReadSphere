import Category from "../models/category.js";
import News from "../models/news.js";
import mongoose from "mongoose";
import createError from "../utils/error.message.js";
import slugify from "slugify";

export const allCategory = async (req,res) => {
    const categories = await Category.find();
    res.status(200).render("admin/categories",{categories, role: req.role});
}

export const addCategoryPage = (req,res) => {
    res.status(200).render("admin/categories/create",{role: req.role});
}

export const addCategory = async (req,res,next) => { 
    try {
        const {name, description} = req.body;
        await Category.create({name, description});
        res.status(200).redirect("/admin/category");
    } catch (error) {
        next(createError(error.message));
    }
}

export const updateCategoryPage = async (req,res,next) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)){
            return next(createError("Invalid Category ID",400));
        }

        const category = await Category.findById(userId);

        if (!category){
            return next(createError("Category Not Found",401));
        }
        res.status(200).render("admin/categories/update",{role: req.role,category});
    } catch (error) {
        next(createError(error.message));
    }
}
export const updateCategory = async (req,res,next) => {
    try {
        const userId = req.params.id;
        const {name, description} = req.body;
        if (!mongoose.Types.ObjectId.isValid(userId)){
            return next(createError("Invalid Category ID",400));
        }
        const slug = slugify(name,{lower: true});
        const category = await Category.findByIdAndUpdate(userId,{name,description,slug},{new: true, runValidators: true});
        if (!category){
            return next(createError("Category Not Found",401));
        }
        res.status(200).redirect("/admin/category");
    } catch (error) {
        next(createError(error.message));
    }
}
export const deleteCategory = async (req,res,next) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)){
            return next(createError("Invalid Category ID",400));
        }

        const category = await Category.findById(userId);
        if (!category){
            return next(createError("Category Not Found",401));
        }

        const article = await News.findOne({category: userId});

        if (article){
            return res.status(400).json({success: false, message: "Category is associated with an article"});
        }

        await category.deleteOne();
        res.status(200).json({success: true});
    } catch (error) {
        next(createError(error.message));
    }
}