import { asyncHandler } from "../utils/asyncHandler.js";
import * as usersService from "../services/users.service.js";

export const updateMyPassword = asyncHandler(async (req, res) => {

        const { currentPassword, newPassword } = req.body;

        await usersService.updateMyPassword(
            req.user.id,
            currentPassword,
            newPassword
        );

        res.status(200).json({ message: "Password updated successfully"});
    }
);