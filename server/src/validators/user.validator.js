import Joi from "joi";

export const updatePasswordSchema = Joi.object({

    currentPassword: Joi.string()
        .required()
        .messages({
            "string.empty": "Current password is required",
            "any.required": "Current password is required"
        }),

    newPassword: Joi.string()
        .min(4)
        .max(12)
        .required()
});

export const userIdSchema = Joi.object({
    id: Joi.string()
        .guid({ version: "uuidv4" })
        .required()
});

export const updateUserStatusSchema = Joi.object({
    isActive: Joi.boolean()
        .strict()
        .required()
});

export const getUsersQuerySchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(20)
});