import express from "express";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { login, register, getMe } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

const router = express.Router();

router.post("/login",validate(loginSchema),login);
router.post("/register",validate(registerSchema),register);
router.get("/me",authenticate,getMe);

export default router;