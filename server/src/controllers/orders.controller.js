import { asyncHandler } from "../utils/asyncHandler.js";
import { create, getMyOrders, getOrderById } from "../services/orders.service.js";

export const createOrder = asyncHandler(async (req, res) => {
    const orderId = await create(req.user.id, req.body);

    res.status(201).json({ id: orderId });
});

export const getCurrentUserOrders = asyncHandler(async (req, res) => {
        const orders = await getMyOrders(req.user.id);

        res.status(200).json({data: {orders}});
    }
);

export const getOrderDetails = asyncHandler( async (req, res) => {
        const order = await getOrderById( req.params.id, req.user.id, req.user.role );
        res.status(200).json({data: { order } });
    }
);