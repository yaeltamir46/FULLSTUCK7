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
        // .guid({
        //     version: [
        //         "uuidv4"
        //     ]
        // })
        .required()

});