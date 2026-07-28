import { login as loginService, register as registerService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const login = asyncHandler(
    async(req,res)=>{
        const { email, password } = req.body;
        const result = await loginService( email, password );
        res.status(200).json({data: result});
    }
);

export const register = asyncHandler(async (req, res) => {

    const result = await registerService(req.body);
    res.status(201).json({data: result, message: "User created successfully"});

});