import express from "express";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/categories.controller.js";

import {
    getCategoriesSchema,
    categoryIdSchema,
    createCategorySchema,
    updateCategorySchema
} from "../validators/categories.validator.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get(
    "/",
    authenticate,
    requireRole("admin"),
    validate(getCategoriesSchema, "query"),
    getCategories
);

router.post(
    "/",
    authenticate,
    requireRole("admin"),
    validate(createCategorySchema, "body"),
    createCategory
);

router.patch(
    "/:id",
    authenticate,
    requireRole("admin"),
    validate(categoryIdSchema, "params"),
    validate(updateCategorySchema, "body"),
    updateCategory
);

router.delete(
    "/:id",
    authenticate,
    requireRole("admin"),
    validate(categoryIdSchema, "params"),
    deleteCategory
);

export default router;