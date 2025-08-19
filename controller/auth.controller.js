import Users from "../models/user.js";
import Category from "../models/category.js";
import News from "../models/news.js";
import Settings from "../models/settings.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import createError from "../utils/error.message.js";
import { uploadToCloudinary, deleteImageFromCloudinary } from "../middleware/multer.js";

export const loginPage = async (req,res) => {
    res.status(200).render("admin/login",{
        layout: false,
    });
}

export const adminLogin = async (req,res,next) => {
 try {
    const {username, password} = req.body;
    const user = await Users.findOne({username});

    if (!user){
        return next(createError("User Not Found", 404));
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched){
        return next(createError("Invalid Password", 401));
    }

    const token = jwt.sign({id: user._id, fullname: user.fullname, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1h"});
    res.cookie("token", token, {
        maxAge: 1000*60*60,
        httpOnly: true,
        secure: false,
    });
    res.status(200).redirect("/admin/dashboard");
 } catch (error) {
    next(createError(error.message));
 }   
}

export const logout = (req,res,next) => {
    try {
        res.clearCookie("token");
        res.status(200).redirect("/admin");
    } catch (error) {
        next(createError(error.message));
    }
}

export const settings = async (req,res) => {
    const settings = await Settings.findOne();
    res.status(200).render("admin/settings", {role: req.role, settings});
}

export const saveSettings = async (req,res,next) => {
    try {
        const {website_title, footer_description} = req.body;

        const settings = await Settings.findOne({});

        if (req.file){
            const website_logo = await uploadToCloudinary(req.file.buffer, "articles");
            deleteImageFromCloudinary(settings.website_logo);
            settings.website_logo = website_logo;
        }
        
        settings.website_title = website_title;
        settings.footer_description = footer_description;

        await settings.save();
        res.status(200).redirect("/admin/settings");
    } catch (error) {
        next(createError(error.message));
    }
}

export const dashboard = async (req,res,next) => {
    try {
        let articleCount;

        if (req.role === "admin"){
            articleCount = await News.countDocuments();
        }
        else{
            articleCount = await News.countDocuments({author: req.id});
        }
        
        const categoryCount = await Category.countDocuments();
        const userCount = await Users.countDocuments();
        res.status(200).render("admin/dashboard", {role: req.role, fullname: req.fullname, articleCount, categoryCount, userCount});   
    } catch (error) {
        next(createError(error.message));
    }
}