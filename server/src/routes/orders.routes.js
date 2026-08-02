import express from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createOrder, getCurrentUserOrders, getOrderDetails } from "../controllers/orders.controller.js";
import { createOrderSchema, orderIdSchema } from "../validators/order.validator.js";

const router = express.Router();

router.post(
    "/",
    authenticate,
    validate(createOrderSchema, "body"),
    createOrder
);

router.get(
    "/my",
    authenticate,
    getCurrentUserOrders
);

router.get(
    "/:id",
    authenticate,
    validate(orderIdSchema, "params"),
    getOrderDetails
);

export default router;