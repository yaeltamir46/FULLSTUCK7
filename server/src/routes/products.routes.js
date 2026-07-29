import express from "express";
import { getProducts, getProductById  } from "../controllers/products.controller.js";
import { validate } from "../middleware/validate.middleware.js"; 
import { getProductsSchema, productIdSchema } from "../validators/product.validator.js";

const router = express.Router();

router.get("/",validate(getProductsSchema),getProducts);
router.get("/:id",validate(productIdSchema, "params"),getProductById);

export default router;