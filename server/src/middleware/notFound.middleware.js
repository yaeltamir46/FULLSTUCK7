import AppError from "../utils/AppError.js";


export function notFoundHandler(req,res,next){

    const error = new AppError(
        404,
        "NOT_FOUND",
        `Route ${req.originalUrl} not found`
    );

    next(error);

}