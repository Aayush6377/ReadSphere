import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import cookie from "cookie-parser";
import flash from "connect-flash";
import expressEjsLayouts from "express-ejs-layouts";
import frontendRoute from "./routes/frontend.js";
import adminRoute from "./routes/admin.js";
import minifyHTML from "express-minify-html-terser";
import compression from "compression";
import cloudinary from "cloudinary";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(path.resolve(), "public"),{maxAge: "1d"}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));
app.use(express.json({limit: '10mb'}));
app.use(cookie(process.env.COOKIE_SECRET));
app.use(expressEjsLayouts);
app.set("view engine","ejs");
app.set("layout","layout");
app.use(compression({
    level: 9,
    threshold: 10*1024,
    filter: (req,res) => {
        if (req.headers["x-no-compression"]){
            return false;
        }
        return compression.filter(req,res);
    }
}));

app.use(minifyHTML({
  override: true,
  htmlMinifierOptions: {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    minifyJS: true,
    minifyCSS: true
  }
}));

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Database connected")
}).catch(err => {
    console.log(err);
});

app.use("/admin",(req,res,next) => {
    res.locals.layout = "admin/layout";
    next();
});

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use("/admin",adminRoute);
app.use("/",frontendRoute);

app.listen(port, ()=>{
    console.log(`App is running at the port ${port}`);
});