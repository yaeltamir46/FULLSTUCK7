import crypto from "crypto";
import db from "../config/db.js";

export async function createMany(connection, orderId, items) {
    for (const item of items) {
        await connection.execute(
            `
            INSERT INTO order_items
            (
                id,
                order_id,
                product_id,
                unit_price,
                quantity
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                crypto.randomUUID(),
                orderId,
                item.productId,
                item.price,
                item.quantity
            ]
        );
    }
}

export async function findByOrderId(orderId, connection= db) {
    const [rows] = await connection.execute(
        `
        SELECT
            oi.id,
            oi.order_id AS orderId,
            oi.product_id AS productId,
            p.name AS productName,
            p.image_url AS imageUrl,
            oi.unit_price AS unitPrice,
            oi.quantity,
            oi.unit_price * oi.quantity AS lineTotal
        FROM order_items oi
        LEFT JOIN products p
            ON p.id = oi.product_id
        WHERE oi.order_id = ?
        `,
        [orderId]
    );

    return rows;
}