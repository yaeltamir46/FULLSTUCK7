import AppError from "../utils/AppError.js";

export function validate(schema, source = "body") {

    return function (req, res, next) {

        const result = schema.validate(
            req[source],
            {
                abortEarly: false,
                stripUnknown: true,
                convert: true
            }
        );

        if (result.error) {

            const details = {};

            result.error.details.forEach((error) => {
                const field = error.path.join(".");
                details[field] = error.message;
            });

            return next(
                new AppError(
                    400,
                    "VALIDATION_ERROR",
                    "Invalid input",
                    details
                )
            );
        }

        if (source === "query") {
            req.validatedQuery = result.value;
        } else {
            req[source] = result.value;
        }

        next();
    };
}