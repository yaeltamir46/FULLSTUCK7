import multer from "multer";
import path from "path";
import AppError from "../utils/AppError.js";

const extensionByMimeType = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
};

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/products");
    },

    filename(req, file, cb) {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            extensionByMimeType[file.mimetype];

        cb(null, uniqueName);
    }
});

function fileFilter(req, file, cb) {
    if (extensionByMimeType[file.mimetype]) {
        return cb(null, true);
    }

    cb(
        new AppError(
            400,
            "IMAGE_UPLOAD_ERROR",
            "Only JPEG, PNG and WebP images are allowed"
        )
    );
}

export const uploadProductImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});