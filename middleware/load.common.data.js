import Category from "../models/category.js";
import Settings from "../models/settings.js";
import News from "../models/news.js";
import NodeCache from "node-cache";

const cache = new NodeCache();

const loadCommonData = async(req,res,next) => {
    try {
        var settings = await Settings.findOne().lean();
        var latestNews = await News.find().sort({createdAt: -1}).limit(5).populate("author","fullname").populate("category",{name: 1, slug: 1}).lean();
        var categories = cache.get("categoriesCache");

        if (!categories){
            const uniqueCategories = await News.distinct("category");
            categories = await Category.find({_id: {$in: uniqueCategories}}).lean();
            cache.set("categoriesCache",categories,60*60);
        }
        
        res.locals.settings = settings;
        res.locals.latestNews = latestNews;
        res.locals.categories = categories;

        next();
    } catch (error) {
        next(error);
    }
}

export default loadCommonData;