import Joi from "joi";

export const createOrderSchema = Joi.object({
    shippingCity: Joi.string()
        .trim()
        .max(100)
        .required(),

    shippingStreet: Joi.string()
        .trim()
        .max(150)
        .required(),

    shippingHouseNumber: Joi.string()
        .trim()
        .max(20)
        .required(),

    shippingApartment: Joi.string()
        .trim()
        .max(20)
        .allow("", null)
        .optional(),

    shippingPostalCode: Joi.string()
        .trim()
        .max(20)
        .allow("", null)
        .optional()
});


export const orderIdSchema = Joi.object({
    id: Joi.string()
        // .guid({
        //     version: "uuidv4"
        // })
        .required()
});