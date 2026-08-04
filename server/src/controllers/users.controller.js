import { asyncHandler } from "../utils/asyncHandler.js";
import  {updateMyPassword as updatePassword, updateUserStatus as changeUserStatus, getAllUsers as getAll} from "../services/users.service.js";

export const updateMyPassword = asyncHandler(async (req, res) => {

        const { currentPassword, newPassword } = req.body;

        await updatePassword(
            req.user.id,
            currentPassword,
            newPassword
        );

        res.status(200).json({ message: "Password updated successfully"});
    }
);

export const getAllUsers = asyncHandler(async (req, res) => {

const { page, limit } = req.validatedQuery;
console.log("page", page, "limit", limit);
    const result = await getAll(page, limit);

    res.status(200).json({
        data: result.users,
        pagination: {
            page,
            limit,
            totalItems: result.totalItems,
            totalPages: Math.ceil(result.totalItems / limit)
        }
    });
});

export const updateUserStatus = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { isActive } = req.body;

    await changeUserStatus(id, isActive);

    res.status(200).json({
        message: isActive
            ? "User activated successfully"
            : "User deactivated successfully"
    });
});