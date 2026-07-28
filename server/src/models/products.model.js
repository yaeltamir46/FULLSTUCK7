import db from "../config/db.js";
import {transactionHandler} from "../utils/transactionHandler.js";

export async function getProducts(offset, limit) {
    console.log({
    limit,
    offset,
    limitNumber: Number(limit),
    offsetNumber: Number(offset)
});
    return transactionHandler(async (connection) => {
        const [products] = await connection.execute(
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

            WHERE p.is_active = true AND p.is_active = true AND p.stock_quantity > 0
            ORDER BY p.created_at DESC
            LIMIT ${Number(limit)} OFFSET ${Number(offset)}`
        );

        const [count] = await connection.execute(
            ` SELECT COUNT(*) AS total
              FROM products
              WHERE is_active=true
             `
        );

        return {
            products,
            totalItems: count[0].total
        };
    })


}