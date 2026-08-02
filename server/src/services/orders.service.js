
import {
    createMany as createOrderItems,
    findByOrderId
} from "../models/orderItems.model.js";
import {
    findCartByUserId,
    clear as clearCart
} from "../models/carts.model.js";

import {
    findByCartIdForUpdate
} from "../models/cartItems.model.js";

import {
    create as createOrder,
    findById as findOrderById,
        findAllByUserId,
    findAccessibleById
} from "../models/orders.model.js";

import {
    decreaseStock
} from "../models/products.model.js";

import { transactionHandler } from "../utils/transactionHandler.js";
import AppError from "../utils/AppError.js";

export async function create(userId, shippingAddress) {
    return await transactionHandler(async (connection) => {
        const cart = await findCartByUserId(userId, connection);

        if (!cart) {
            throw new AppError(
                400,
                "CART_EMPTY",
                "Cart is empty"
            );
        }

        const items = await findByCartIdForUpdate(connection,cart.id);

        if (items.length === 0) {
            throw new AppError(
                400,
                "CART_EMPTY",
                "Cart is empty"
            );
        }

        let totalPrice = 0;

        for (const item of items) {
            if (!item.isActive) {
                throw new AppError(
                    409,
                    "PRODUCT_UNAVAILABLE",
                    `${item.name} is no longer available`,
                    {
                        productId: item.productId
                    }
                );
            }

            if (item.quantity > item.stockQuantity) {
                throw new AppError(
                    409,
                    "INSUFFICIENT_STOCK",
                    `Not enough stock for ${item.name}`,
                    {
                        productId: item.productId,
                        requested: item.quantity,
                        available: item.stockQuantity
                    }
                );
            }

            totalPrice += Number(item.price) * item.quantity;
        }

        totalPrice = Number(totalPrice.toFixed(2));

        const orderId = await createOrder(
            connection,
            userId,
            totalPrice,
            shippingAddress
        );

        await createOrderItems(
            connection,
            orderId,
            items
        );

        for (const item of items) {
            const stockUpdated = await decreaseStock(
                connection,
                item.productId,
                item.quantity
            );

            if (!stockUpdated) {
                throw new AppError(
                    409,
                    "INSUFFICIENT_STOCK",
                    `Not enough stock for ${item.name}`,
                    {
                        productId: item.productId
                    }
                );
            }
        }

        await clearCart(cart.id, connection); //TODO: check if need to check if there are items in the cart that not beeb ordered

        // const order = await findOrderById(
        //     connection,
        //     orderId,
        //     userId
        // );

        // const orderItems = await findByOrderId(
        //     connection,
        //     orderId
        // );

        // return {
        //     ...order,
        //     items: orderItems
        // };
        return orderId;
    });
}
export async function getMyOrders(userId) {
    const orders = await findAllByUserId(userId);

    return orders.map(order => ({
        ...order,
        totalPrice: Number(order.totalPrice),
        totalItems: Number(order.totalItems)
    }));
}

export async function getOrderById(
    orderId,
    userId,
    userRole
) {
    const order = await findAccessibleById(
        orderId,
        userId,
        userRole
    );

    if (!order) {
        throw new AppError(
            404,
            "ORDER_NOT_FOUND",
            "Order not found"
        );
    }

    const items = await findByOrderId(orderId);

    return {
        ...order,
        totalPrice: Number(order.totalPrice),

        items: items.map(item => ({
            ...item,
            unitPrice: Number(item.unitPrice),
            quantity: Number(item.quantity),
            lineTotal: Number(item.lineTotal)
        }))
    };
}