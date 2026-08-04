import Joi from "joi";

export const getProductsSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(12)
});

export const productIdSchema = Joi.object({
    id: Joi.string()
        .guid({ version: "uuidv4" })
        .required()
});

export const createProductSchema = Joi.object({
    categoryId: Joi.string()
        // .guid({ version: "uuidv4" })
        .required(),

    name: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required(),

    description: Joi.string()
        .trim()
        .min(1)
        .required(),

    price: Joi.number()
        .positive()
        .precision(2)
        .required(),

    stockQuantity: Joi.number()
        .integer()
        .min(0)
        .required(),

    // imageUrl: Joi.string()
    //     .uri()
    //     .max(500)
    //     .allow(null, "")
    //     .optional()
});

export const updateProductSchema = Joi.object({
    categoryId: Joi.string()
        .guid({ version: "uuidv4" }),

    name: Joi.string()
        .trim()
        .min(2)
        .max(150),

    description: Joi.string()
        .trim()
        .min(1),

    price: Joi.number()
        .positive()
        .precision(2),

    stockQuantity: Joi.number()
        .integer()
        .min(0),

    imageUrl: Joi.string()
        .uri()
        .max(500)
        .allow(null, "")
});