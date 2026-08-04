import express from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { updateMyPassword, getAllUsers, updateUserStatus } from "../controllers/users.controller.js";
import { updatePasswordSchema, userIdSchema, updateUserStatusSchema , getUsersQuerySchema} from "../validators/user.validator.js";

const router = express.Router();

router.patch(
    "/me",
    authenticate,
    validate(updatePasswordSchema, "body"),
    updateMyPassword
);

router.get(
    "/",
    authenticate,
    requireRole("admin"),
    validate(getUsersQuerySchema, "query"),
    getAllUsers
);

router.patch(
    "/:id/status",
    authenticate,
    requireRole("admin"),
    validate(userIdSchema, "params"),
    validate(updateUserStatusSchema, "body"),
    updateUserStatus
);

export default router;