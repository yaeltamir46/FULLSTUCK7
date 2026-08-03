import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
    createOrder,
    getCurrentUserOrders,
    getOrderDetails,
    getAllOrders,
    updateOrderStatus
} from "../controllers/orders.controller.js";
import { createOrderSchema, orderIdSchema, updateOrderStatusSchema, getOrdersQuerySchema } from "../validators/order.validator.js";

const router = express.Router();

router.get(
    "/",
    authenticate,
    validate(getOrdersQuerySchema, "query"),
    requireRole("admin"),
    getAllOrders
);

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

router.patch(
    "/:id/status",
    authenticate,
    requireRole("admin"),
    validate(orderIdSchema,"params"),
    validate(updateOrderStatusSchema,"body"),
    updateOrderStatus
);

export default router;
