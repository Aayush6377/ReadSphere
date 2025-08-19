import mongoose from "mongoose";
import Comment from "../models/comment.js";
import News from "../models/news.js";
import createError from "../utils/error.message.js";

export const allComments = async (req,res,next) => {
    try {
        let comments;
        if (req.role === "admin"){
            comments = await Comment.find().populate("article","title").sort({createdAt: -1});
        }
        else{
            const articles = await News.find({author: req.id});
            const articlesId = articles.map(i => i._id);
            comments = await Comment.find({article: {$in: articlesId}}).populate("article","title").sort({createdAt: -1});
        }

        res.status(200).render("admin/comments",{role: req.role, comments});
    } catch (error) {
        next(error);
    }
}


export const updateCommentStatus = async (req,res,next) => {
    try {
        const commentId = req.params.id;
        const status  = req.body.status;

        if (!mongoose.Types.ObjectId.isValid(commentId)){
            return res.status(400).json({message: "Comment ID is Not Valid"});
        }

        const update = await Comment.findByIdAndUpdate(commentId, {status}, {new: true});

        if (!update){
            return res.status(404).json({message: "Comment NOT Found"});
        }

        res.status(200).json({success: true, message: "Comment updated"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const deleteComment = async (req,res,next) => {
    try {
        const commentId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(commentId)){
            return res.status(400).json({message: "Comment ID is Not Valid"});
        }

        const del = await Comment.findByIdAndDelete(commentId);

        if (!del){
            return res.status(404).json({message: "Comment NOT Found"});
        }

        res.status(200).json({success: true, message: "Comment deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}