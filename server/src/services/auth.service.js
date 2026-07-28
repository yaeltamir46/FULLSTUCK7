import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import { findByEmail, createUser } from "../models/users.model.js";
import { generateToken } from "../utils/generateToken.js";

export async function login( email, password ){

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

export async function register(userData) {

    const {firstName, lastName, email, password} = userData;

    const existingUser = await findByEmail(email);

    if (existingUser) {
        throw new AppError(
            409,
            "USER_ALREADY_EXISTS",
            "User with this email already exists"
        );
    }

    const userId = await createUser(firstName, lastName, email, password);

    const token = generateToken({ id: userId, role: 'customer' });
    
    return { userId, token};

    

}