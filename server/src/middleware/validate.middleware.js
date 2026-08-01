import AppError from "../utils/AppError.js";
export function validate(schema, source = "body"){

    return function(req,res,next){

        const result = schema.validate(
            req[source],
            {
                abortEarly:false
            }
        );

        if(result.error){

            const details={};

            result.error.details.forEach(err=>{
                const field = err.path.join(".");
                details[field]=err.message;
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

        req[source] = result.value;

        next();
    };
}