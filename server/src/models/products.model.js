import db from "../config/db.js";
import { transactionHandler } from "../utils/transactionHandler.js";

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

        WHERE
            p.is_active = TRUE
            AND p.deleted_at IS NULL
            AND p.stock_quantity > 0
        ORDER BY p.created_at DESC
        LIMIT ${Number(limit)} OFFSET ${Number(offset)}`
    );

    const [count] = await db.execute(
        ` SELECT COUNT(*) AS total
            FROM products
            WHERE
    is_active = TRUE
    AND deleted_at IS NULL
    AND stock_quantity > 0
            `
    );
const normalizedProducts = products.map(product => ({
    ...product,
    price: Number(product.price)
}));
    return {
        products: normalizedProducts,
        totalItems: count[0].total
    };

}

export async function getAdminProducts(offset, limit) {

    const offsetNumber = Number(offset);
    const limitNumber = Number(limit);

    const [rows] = await db.execute(
        `
        SELECT
            p.id,
            p.category_id AS categoryId,
            c.name AS categoryName,
            p.name,
            p.description,
            p.price,
            p.stock_quantity AS stockQuantity,
            p.image_url AS imageUrl,
            p.is_active AS isActive,
            p.deleted_at AS deletedAt,
            p.created_at AS createdAt,
            p.updated_at AS updatedAt
        FROM products p
        LEFT JOIN categories c
            ON c.id = p.category_id
        ORDER BY p.created_at DESC
        LIMIT ${limitNumber} OFFSET ${offsetNumber}
        `
    );

    const [countRows] = await db.execute(
        `
        SELECT COUNT(*) AS totalItems
        FROM products
        `
    );

    const products = rows.map(product => ({
        ...product,
        price: Number(product.price),
        stockQuantity: Number(product.stockQuantity),
        isActive: Boolean(product.isActive)
    }));

    return {
        products,
        totalItems: Number(countRows[0].totalItems)
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
        [productId]
    );

    const product = rows[0] || null;

if (product) {
    product.price = Number(product.price);
    product.isActive = Boolean(product.isActive);
}

return product;

}

export async function decreaseStock(connection, productId, quantity) {
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

//TODO: move this to category model and service
export async function findActiveCategoryById(categoryId) {

    const [rows] = await db.execute(
        `
        SELECT id
        FROM categories
        WHERE
            id = ?
            AND is_active = TRUE
            AND deleted_at IS NULL
        `,
        [categoryId]
    );

    return rows[0] || null;
}

export async function insertProduct(product) {

    const {
        id,
        categoryId,
        name,
        description,
        price,
        stockQuantity,
        imageUrl = null
    } = product;

    await db.execute(
        `
        INSERT INTO products (
            id,
            category_id,
            name,
            description,
            price,
            stock_quantity,
            image_url
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            id,
            categoryId,
            name,
            description,
            price,
            stockQuantity,
            imageUrl || null
        ]
    );
}

export async function updateProductById(productId, changes) {

    const columnMap = {
        categoryId: "category_id",
        name: "name",
        description: "description",
        price: "price",
        stockQuantity: "stock_quantity",
        imageUrl: "image_url"
    };

    const setParts = [];
    const values = [];

    for (const [field, column] of Object.entries(columnMap)) {
        if (changes[field] !== undefined) {
            setParts.push(`${column} = ?`);
            values.push(
                field === "imageUrl"
                    ? changes[field] || null
                    : changes[field]
            );
        }
    }

    values.push(productId);

    const [result] = await db.execute(
        `
        UPDATE products
        SET ${setParts.join(", ")}
        WHERE
            id = ?
            AND is_active = TRUE
            AND deleted_at IS NULL
        `,
        values
    );

    return result.affectedRows === 1;
}

export async function softDeleteProduct(productId) {

    const [result] = await db.execute(
        `
        UPDATE products
        SET
            is_active = FALSE,
            deleted_at = CURRENT_TIMESTAMP
        WHERE
            id = ?
            AND is_active = TRUE
            AND deleted_at IS NULL
        `,
        [productId]
    );

    return result.affectedRows === 1;
}