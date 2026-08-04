import express from "express";

import {
    getProducts,
    getAdminProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/products.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { uploadProductImage } from "../middleware/upload.middleware.js";

import {
    getProductsSchema,
    productIdSchema,
    createProductSchema,
    updateProductSchema
} from "../validators/product.validator.js";

const router = express.Router();

router.get(
    "/",
    validate(getProductsSchema, "query"),
    getProducts
);

router.post(
    "/",
    authenticate,
    requireRole("admin"),
     uploadProductImage.single("image"),
    validate(createProductSchema, "body"),
    createProduct
);

router.get(
    "/admin",
    authenticate,
    requireRole("admin"),
    validate(getProductsSchema, "query"),
    getAdminProducts
);

router.patch(
    "/:id",
    authenticate,
    requireRole("admin"),
    validate(productIdSchema, "params"),
    uploadProductImage.single("image"),
    validate(updateProductSchema, "body"),
    updateProduct
);

router.delete(
    "/:id",
    authenticate,
    requireRole("admin"),
    validate(productIdSchema, "params"),
    deleteProduct
);

router.get(
    "/:id",
    validate(productIdSchema, "params"),
    getProductById
);

export default router;