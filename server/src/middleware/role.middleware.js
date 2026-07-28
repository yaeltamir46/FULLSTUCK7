import AppError from "../utils/AppError.js";

export function requireRole(...allowedRoles){
    return function(req,res,next){
        if(!req.user){
            return next(
                new AppError(
                    401,
                    "UNAUTHENTICATED",
                    "Authentication required"
                )
            );
        }

        if(!allowedRoles.includes(req.user.role)){
            return next(
                new AppError(
                    403,
                    "FORBIDDEN",
                    "You do not have permission to access this resource"
                )
            );
        }
        next();
    };

}