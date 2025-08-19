import {body,validationResult} from "express-validator";
import Users from "../models/user.js";
import bcrypt from "bcryptjs";
import Category from "../models/category.js";
import News from "../models/news.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export const loginValidation = [
    body("username").trim()
    .notEmpty().withMessage("Username shouldn't be empty")
    .matches(/^\S+$/).withMessage("Username must not include spaces")
    .custom(async (value,{req})=>{
        const user = await Users.findOne({username: value});
        if (!user){
            return Promise.reject(`Username ${value} doesn't exists`);
        }
        req.user = user;
        return true;
    }),

    body("password").trim()
    .notEmpty().withMessage("Password is required")
    .isLength({min: 5, max: 12}).withMessage("Password must be 5 to 12 characters long")
    .custom(async (value, {req}) => {
        const user = req.user;
        if (!user) {
            return Promise.reject("Invalid username or password");
        }
        const isMatched = await bcrypt.compare(value, user.password);
        if (!isMatched){
            return Promise.reject("Password is incorrect");
        }
        return true;
    })
];

export const userAddValidation = [
    body("fullname").trim()
    .notEmpty().withMessage("Fullname is required")
    .isLength({min: 5,max: 25}).withMessage("Fullname must be 5 to 25 chracters long"),

    body("username").trim()
    .notEmpty().withMessage("Username is required")
    .isLength({min: 8}).withMessage("Username must be 8 character long")
    .custom(async (value) => {
        const user = await Users.findOne({username: value});
        if (user){
            return Promise.reject(`Username ${value} already exists`);
        }
        return true;
    }),

    body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({min: 8}).withMessage("Password must be 8 characters long")
    .isStrongPassword().withMessage("Password must contains an uppercase, lowercase, digit and a special character"),

    body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["admin","author"]).withMessage("Role must be admin or author")
];

export const userUpdateValidation = [
    body("fullname").trim()
    .notEmpty().withMessage("Fullname is required")
    .isLength({min: 5,max: 25}).withMessage("Fullname must be 5 to 25 chracters long"),

    body("username")
    .custom(async (value, { req }) => {
        const user = await Users.findById(req.params.id);
        if (!user) {
            return Promise.reject("User not found");
        }
        if (value !== user.username) {
            return Promise.reject("Username can't be altered");
        }
        return true;
    }),

    body("password")
    .optional({checkFalsy: true})
    .isLength({min: 8}).withMessage("Password must be 8 characters long")
    .isStrongPassword().withMessage("Password must contains an uppercase, lowercase, digit and a special character"),
    
    body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["admin","author"]).withMessage("Role must be admin or author")
];

export const categoryAddValidation = [
    body("name").trim()
    .notEmpty().withMessage("Category name is required")
    .isLength({min: 3}).withMessage("Category name should be at least 3 character long")
    .custom(async (value)=>{
        const category = await Category.findOne({name: value});
        if (category){
            return Promise.reject(`Category ${value} already exists`);
        }
        return true;
    }),

    body("description")
    .notEmpty().withMessage("Categor description is required")
    .isLength({max: 100}).withMessage("Description must be at most 100 characters long")
];

export const categoryUpdateValidation = [
    body("name").trim()
    .notEmpty().withMessage("Category name is required")
    .isLength({min: 3}).withMessage("Category name should be at least 3 character long")
    .custom(async (value, {req}) => {
        const category = await Category.findOne({name: value, _id: {$ne: req.params.id}});
        if (category){
             return Promise.reject(`Category ${value} already exists`);
        }
        return true;
    }),

    body("description")
    .notEmpty().withMessage("Categor description is required")
    .isLength({max: 100}).withMessage("Description must be at most 100 characters long")
];

export const articleValidation = [
    body("title").trim()
    .notEmpty().withMessage("Title is required")
    .isLength({min: 10, max: 100}).withMessage("Title must be 10 to 100 characters long"),

    body("content").trim()
    .notEmpty().withMessage("Content is required")
    .isLength({min: 100}).withMessage("Content must be minimum 100 characters long"),

    body("category").trim()
    .notEmpty().withMessage("Category is required")
    .custom(async (value)=>{
        if (!mongoose.Types.ObjectId.isValid(value)){
            return Promise.reject("Invalid Category ID");
        }

        const category = await Category.findById(value);
        if (!category){
            return Promise.reject("Category Not Found");
        }
        return true;
    }),

    body("image").optional({checkFalsy: true})
    .custom((value, {req}) => {
        if (!req.file){
            throw new Error("Image is required");
        }

        if (!(req.file.mimetype).startsWith("image/")){
            throw new Error("Only image files are allowed");
        }
        return true;
    })
];

export const handler = (renderpage, layout = true) => {
    return async (req,res,next) => {
        const err = validationResult(req);
        if (!err.isEmpty()){
            let errList = {};
            err.array().forEach(e => {
                errList[e.path] = e.msg;
            });

            if (layout && req.role === "admin"){
                layout = "admin/layout";
            }
            let user = {};
            let category ={};
            let article = {};
            const categories = await Category.find();
            if (req.params.id){
                user._id = category._id = article._id =req.params.id;
                user.username = req.body?.username;
                const articleObj = await News.findById(article._id);
                article.image = articleObj.image;
            }
            if (req.file){
                fs.unlink(path.join("public","uploads",req.file?.filename), err => {if (err) console.log(err)});
            }
            return res.status(400).render(renderpage,{old: req.body, errList, role: req.role, layout, user, category, article, categories});
        }
        next();
    } 
}