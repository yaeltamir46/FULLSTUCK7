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