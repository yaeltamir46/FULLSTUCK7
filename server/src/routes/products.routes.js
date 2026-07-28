import express from "express";
import { getProducts } from "../controllers/products.controller.js";
import { validate } from "../middleware/validate.middleware.js"; 
import { getProductsSchema } from "../validators/product.validator.js";

const router = express.Router();

router.get("/",validate(getProductsSchema),getProducts);

export default router;