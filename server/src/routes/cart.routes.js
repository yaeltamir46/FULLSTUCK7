import express from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { addCartItemSchema } from "../validators/cart.validator.js";
import { getCart, addCartItem } from "../controllers/cart.controller.js";
import { updateCartItem } from "../controllers/cart.controller.js";
import { updateCartItemSchema,updateCartQuantitySchema} from "../validators/cart.validator.js";
import { removeCartItem } from "../controllers/cart.controller.js";
import { productIdSchema } from "../validators/cart.validator.js";
import { clearCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", authenticate, getCart);
router.post( "/items", authenticate, validate(addCartItemSchema), addCartItem );
router.patch("/items/:productId",authenticate,validate(updateCartItemSchema, "params"),validate(updateCartQuantitySchema, "body"),updateCartItem);
router.delete("/items/:productId", authenticate, validate(productIdSchema, "params"),removeCartItem);
router.delete( "/", authenticate, clearCart );

export default router;