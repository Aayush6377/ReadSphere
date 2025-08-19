import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "public","uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const limits = {
    fileSize: 1024*1024*5
};

const fileFilter = (req,file,cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cb(null, true);
    }
    else{
        cb(new Error("Only jpeg and png files are allowed"),false);
    }
}

const uploader = multer({
    storage, limits, fileFilter
});

export default uploader;
