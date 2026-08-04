import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import {
    updatePassword,
    findByIdWithPassword,
    findAllUsers,
    findUserByIdForAdmin,
    updateStatus
} from "../models/users.model.js";

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

export async function getAllUsers(page, limit) {

    const offset = (page - 1) * limit;

    return await findAllUsers(limit, offset);
}

export async function updateUserStatus(userId, isActive) {

    const user = await findUserByIdForAdmin(userId);
    if (!user) {
        throw new AppError(
            404,
            "USER_NOT_FOUND",
            "User not found"
        );
    }

    if (user.role === "admin") {
    throw new AppError(
        403,
        "ADMIN_STATUS_CHANGE_FORBIDDEN",
        "An admin account status cannot be changed"
    );
}

    if (user.isActive === isActive) {
        return;
    }

    await updateStatus(userId, isActive);
}