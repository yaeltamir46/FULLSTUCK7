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
        //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI4ODY0MTU3LTUyMzgtNDVkMy1iZjQwLTMxZjY5ZGM3ZGYwZiIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc4NTYyMDQ3MywiZXhwIjoxNzg1NzA2ODczfQ.jQS-MdgZLhMq6QS2WvtsXGqOyFAMJ2oGwzWz-_h-12I
        const decoded = jwt.verify(token, env.jwtSecret);

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    }
    catch(err){
        console.error("Authentication error:", err);
        next(
            new AppError(
                401,
                "UNAUTHENTICATED",
                "Invalid token"
            )
        );
    }

}