import { login as loginService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const login = asyncHandler(
    async(req,res)=>{
        const { email, password } = req.body;
        const result = await loginService( email, password );
        res.status(200).json({data: result});
    }
);