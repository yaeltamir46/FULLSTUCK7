import db from "../config/db.js";
import {transactionHandler} from "../utils/transactionHandler.js";

export async function getProducts(offset, limit) {
    const [products] = await db.execute(
        `   SELECT
            p.id,
            p.category_id AS categoryId,
            c.name AS categoryName,
            p.name,
            p.description,
            p.price,
            p.stock_quantity AS stockQuantity,
            p.image_url AS imageUrl

        FROM products p

        LEFT JOIN categories c
        ON p.category_id = c.id

        WHERE p.is_active = true AND p.stock_quantity > 0
        ORDER BY p.created_at DESC
        LIMIT ${Number(limit)} OFFSET ${Number(offset)}`
    );

    const [count] = await db.execute(
        ` SELECT COUNT(*) AS total
            FROM products
            WHERE is_active=true
            `
    );

    return {
        products,
        totalItems: count[0].total
    };
   
}

export async function findById(productId) {
    const [rows] = await db.execute(
        ` SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.stock_quantity AS stockQuantity,
            p.image_url AS imageUrl,
            p.category_id AS categoryId,
            c.name AS categoryName,
            p.is_active AS isActive

            FROM products p
            INNER JOIN categories c ON c.id = p.category_id
            WHERE p.id = ? AND p.is_active = TRUE `,
        [ productId ]
    );

    return rows[0] || null;

}

export async function decreaseStock(connection,productId,quantity) {
    const [result] = await connection.execute(
        `
        UPDATE products
        SET stock_quantity = stock_quantity - ?
        WHERE
            id = ?
            AND is_active = TRUE
            AND stock_quantity >= ?
        `,
        [quantity, productId, quantity]
    );

    return result.affectedRows === 1;
}