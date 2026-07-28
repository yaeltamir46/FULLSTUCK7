import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import { findByEmail } from "../models/users.model.js";
import { generateToken } from "../utils/generateToken.js";

export async function login( email, password ){
    if(!email || !password){
        throw new AppError(
            400,
            "MISSING_CREDENTIALS",
            "Email and password are required"
        );
    }
    
    const user = await findByEmail(email);

    if(!user){
        throw new AppError(
            401,
            "INVALID_CREDENTIALS",
            "Invalid email or password"
        );
    }

    if(!user.isActive){
        throw new AppError(
            401,
            "USER_INACTIVE",
            "User is inactive"
        );
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if(!passwordMatch){

        throw new AppError(
            401,
            "INVALID_CREDENTIALS",
            "Invalid email or password"
        );

    }

    const token = generateToken(user);
    return {
        user:{
            id:user.id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            // role:user.role,
            // isActive:user.isActive,
            // createdAt:user.createdAt
        },
        token
    };

}