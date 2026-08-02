import crypto from "crypto";
import db from "../config/db.js";

export async function create(
    connection,
    userId,
    totalPrice,
    shippingAddress
) {
    const orderId = crypto.randomUUID();

    await connection.execute(
        `
        INSERT INTO orders
        (
            id,
            user_id,
            total_price,
            shipping_city,
            shipping_street,
            shipping_house_number,
            shipping_apartment,
            shipping_postal_code
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            orderId,
            userId,
            totalPrice,
            shippingAddress.shippingCity,
            shippingAddress.shippingStreet,
            shippingAddress.shippingHouseNumber,
            shippingAddress.shippingApartment || null,
            shippingAddress.shippingPostalCode || null
        ]
    );

    return orderId;
}

export async function findById(connection, orderId, userId) {
    const [rows] = await connection.execute(
        `
        SELECT
            id,
            user_id AS userId,
            total_price AS totalPrice,
            status,
            shipping_city AS shippingCity,
            shipping_street AS shippingStreet,
            shipping_house_number AS shippingHouseNumber,
            shipping_apartment AS shippingApartment,
            shipping_postal_code AS shippingPostalCode,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM orders
        WHERE id = ? AND user_id = ?
        `,
        [orderId, userId]
    );

    return rows[0] || null;
}

export async function findAllByUserId(userId) {
    const [rows] = await db.execute(
        `
        SELECT
            o.id,
            o.user_id AS userId,
            o.total_price AS totalPrice,
            o.status,
            o.shipping_city AS shippingCity,
            o.shipping_street AS shippingStreet,
            o.shipping_house_number AS shippingHouseNumber,
            o.shipping_apartment AS shippingApartment,
            o.shipping_postal_code AS shippingPostalCode,
            o.created_at AS createdAt,
            o.updated_at AS updatedAt,
            COALESCE(SUM(oi.quantity), 0) AS totalItems
        FROM orders o
        LEFT JOIN order_items oi
            ON oi.order_id = o.id
        WHERE o.user_id = ?
        GROUP BY
            o.id,
            o.user_id,
            o.total_price,
            o.status,
            o.shipping_city,
            o.shipping_street,
            o.shipping_house_number,
            o.shipping_apartment,
            o.shipping_postal_code,
            o.created_at,
            o.updated_at
        ORDER BY o.created_at DESC
        `,
        [userId]
    );

    return rows;
}

export async function findAccessibleById(
    orderId,
    userId,
    userRole
) {
    let query = `
        SELECT
            o.id,
            o.user_id AS userId,
            o.total_price AS totalPrice,
            o.status,
            o.shipping_city AS shippingCity,
            o.shipping_street AS shippingStreet,
            o.shipping_house_number AS shippingHouseNumber,
            o.shipping_apartment AS shippingApartment,
            o.shipping_postal_code AS shippingPostalCode,
            o.created_at AS createdAt,
            o.updated_at AS updatedAt
        FROM orders o
        WHERE o.id = ?
    `;

    const values = [orderId];

    if (userRole !== "admin") {
        query += ` AND o.user_id = ?`;
        values.push(userId);
    }

    const [rows] = await db.execute(query, values);

    return rows[0] || null;
}