import multer from "multer";
import path from "path";
import cloudinary from "cloudinary";


const storage = multer.memoryStorage();

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


export const uploadToCloudinary = (fileBuffer, folder = "articles") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url); 
            }
        );
        stream.end(fileBuffer);
    });
};

export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    const parts = imageUrl.split("/upload/"); 
    if (parts.length < 2) throw new Error("Invalid Cloudinary URL");

    let publicIdWithVersion = parts[1]; 
    const publicIdParts = publicIdWithVersion.split("/"); 

    if (publicIdParts[0].startsWith("v")) publicIdParts.shift();
    const publicId = publicIdParts.join("/").replace(/\.[^/.]+$/, "");

    await cloudinary.v2.uploader.destroy(publicId);
    console.log(`Image deleted successfully: ${publicId}`);
  } catch (error) {
    console.error("Cloudinary deletion error:", error.message);
  }
};


export default uploader;
