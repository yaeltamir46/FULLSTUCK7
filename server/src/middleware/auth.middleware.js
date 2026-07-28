import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import { env } from "../config/env.js";

export async function authenticate(req,res,next){

    try {

        const authHeader = req.headers.authorization;

        if(!authHeader){
            throw new AppError(
                401,
                "UNAUTHENTICATED",
                "Authentication required"
            );
        }

        const parts = authHeader.split(" ");

        if( parts.length !== 2 || parts[0] !== "Bearer" ){

            throw new AppError(
                401,
                "UNAUTHENTICATED",
                "Invalid authorization format"
            );

        }
        const token = parts[1];
        const decoded = jwt.verify(token, env.JWT_SECRET);

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    }
    catch(err){
        next(
            new AppError(
                401,
                "UNAUTHENTICATED",
                "Invalid token"
            )
        );
    }

}