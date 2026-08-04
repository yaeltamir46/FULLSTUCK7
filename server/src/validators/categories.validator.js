import Joi from "joi";

export const getCategoriesSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
})
    .and("page", "limit")
    .messages({
        "object.and":
            "page and limit must be provided together"
    });

export const categoryIdSchema = Joi.object({
    id: Joi.string()
        .guid({ version: "uuidv4" })
        .required()
});

export const createCategorySchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    description: Joi.string()
        .trim()
        .max(500)
        .allow("")
        .optional()
});

export const updateCategorySchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100),

    description: Joi.string()
        .trim()
        .max(500)
        .allow("", null)
})
    .min(1);