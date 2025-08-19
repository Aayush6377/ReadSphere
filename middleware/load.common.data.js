import Category from "../models/category.js";
import Settings from "../models/settings.js";
import News from "../models/news.js";
import NodeCache from "node-cache";

const cache = new NodeCache();

const loadCommonData = async(req,res,next) => {
    try {
        var settings = cache.get("settingsCache");
        var latestNews = cache.get("latestNewsCache");
        var categories = cache.get("categoriesCache");

        if (!latestNews && !settings && !categories){
            settings = await Settings.findOne().lean();
            latestNews = await News.find().sort({createdAt: -1}).limit(5).populate("author","fullname").populate("category",{name: 1, slug: 1}).lean();
            const uniqueCategories = await News.distinct("category");
            categories = await Category.find({_id: {$in: uniqueCategories}}).lean();

            cache.set("settingsCache",settings,60*60);
            cache.set("latestNewsCache",latestNews,60*60);
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