import multer from "multer";
import path from "path";
import AppError from "../utils/AppError.js";

const storage = multer.diskStorage(
    { destination(req,file,cb){ cb( null, "uploads/products" ); },
    filename(req,file,cb){ const uniqueName = 
                                                Date.now()
                                                + "-"
                                                + Math.round(Math.random()*1E9)
                                                + path.extname(file.originalname);
                            cb(null,uniqueName);
                        }
    });

function fileFilter(req,file,cb){
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];
    if( allowedTypes.includes(file.mimetype)){ cb(null,true); }
    else {

        cb(
            new AppError(
                400,
                "IMAGE_UPLOAD_ERROR",
                "Only jpeg, png and webp images are allowed"
            )
        );

    }
}

export const uploadProductImage = multer({ storage, 
                                           fileFilter, 
                                           limits:{ fileSize:5 * 1024 * 1024}
                                        });