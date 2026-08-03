import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import {updatePassword, findByIdWithPassword} from "../models/users.model.js";

export async function updateMyPassword(userId,currentPassword,newPassword) {

    const user = await findByIdWithPassword(userId);

    if (!user) {
        throw new AppError(
            404,
            "USER_NOT_FOUND",
            "User not found"
        );
    }

    const currentPasswordMatches = await bcrypt.compare(currentPassword,user.passwordHash);

    if (!currentPasswordMatches) {
        throw new AppError(
            400,
            "INVALID_CURRENT_PASSWORD",
            "Current password is incorrect"
        );
    }

    const newPasswordHash = await bcrypt.hash(newPassword,10);

    await updatePassword(userId,newPasswordHash);
}