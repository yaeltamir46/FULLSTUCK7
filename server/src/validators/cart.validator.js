import Joi from "joi";

export const addCartItemSchema = Joi.object({

    productId: Joi.string()
        // .guid({
        //     version: "uuidv4"
        // })
        .required(),

    quantity: Joi.number()
        .integer()
        .min(1)
        .required()

});

export const updateCartItemSchema = Joi.object({

    productId: Joi.string()
        // .guid({
        //     version: "uuidv4"
        // })
        .required()

});

export const updateCartQuantitySchema = Joi.object({

    quantity: Joi.number()
        .integer()
        .min(1)
        .required()

});

export const productIdSchema = Joi.object({

    productId: Joi.string()
        // .guid({
        //     version: "uuidv4"
        // })
        .required()

});