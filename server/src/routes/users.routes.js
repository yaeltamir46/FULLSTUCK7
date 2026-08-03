import express from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { updateMyPassword } from "../controllers/users.controller.js";

import { updatePasswordSchema } from "../validators/user.validator.js";

const router = express.Router();

router.patch(
    "/me",
    authenticate,
    validate(updatePasswordSchema, "body"),
    updateMyPassword
);

export default router;