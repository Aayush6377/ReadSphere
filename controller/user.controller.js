import Users from "../models/user.js";
import News from "../models/news.js";
import mongoose from "mongoose";
import createError from "../utils/error.message.js";

export const allUsers = async (req,res) => {
    const users = await Users.find();
    res.status(200).render("admin/users",{users, role: req.role});
}

export const addUserPage = (req,res) => {
    res.status(200).render("admin/users/create", {role: req.role});
}
export const addUser = async (req,res,next) => {
    try {
        await Users.create(req.body);
        res.status(200).redirect("/admin/users");
    } catch (error) {
        next(createError(error.message));
    }
}

export const updateUserPage = async (req,res,next) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)){
             return next(createError("Invalid User ID",400));
        }

        const userData = await Users.findById(userId);
        if(!userData){
             return next(createError("User Not Found",404));
        }
        res.status(200).render("admin/users/update",{user: userData, role: req.role});
    } catch (error) {
       next(createError(error.message));
    }
}
export const updateUser = async (req,res,next) => {
    try {
        const userId = req.params.id;
        const {fullname, password, role} = req.body;
        if (!mongoose.Types.ObjectId.isValid(userId)){
            return next(createError("Invalid User ID",400));
        }

        const update = await Users.findById(userId);
        if (!update){
             return next(createError("User Not Found",404));
        }

        update.fullname = fullname || update.fullname;
        if (password) update.password = password;
        update.role = role || update.role;
        await update.save();
        res.status(200).redirect("/admin/users");
    } catch (error) {
        next(createError(error.message));
    }
}

export const deleteUser = async (req,res,next) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)){
            return next(createError("Invalid User ID",400));
        }
        
        const del = await Users.findById(userId);
        if (!del){
             return next(createError("User Not Found",404));
        }

        const article = await News.findOne({author: userId});

        if (article){
            return res.status(400).json({success: false, message: "User is associated with an article. Delete the article first."});
        }

        await del.deleteOne();

        if (userId === req.id){
            return res.status(200).redirect("/admin/logout");
        }

        res.status(200).json({success: true});
    } catch (error) {
        next(createError(error.message));
    }
}



