import db from "../config/db.js";
import crypto from "crypto";

export async function findByCartId(cartId) {

    const [rows] = await db.execute(
        ` SELECT
            ci.cart_id AS cartId,
            ci.product_id AS productId,
            p.name,
            p.price,
            p.image_url AS imageUrl,
            p.stock_quantity AS stockQuantity,
            ci.quantity

        FROM cart_items ci
        INNER JOIN products p
            ON p.id = ci.product_id
        WHERE
            ci.cart_id = ? AND p.is_active = TRUE
        `,
        [ cartId ]

    );

    return rows;

}

export async function findItem(cartId,productId)
{
    const [rows] = await db.execute(
        ` SELECT * FROM cart_items
          WHERE cart_id=? AND product_id=?
        `,
        [cartId,productId]
    );
    console.log("findItem rows", rows);

    return rows[0] || null;

}


export async function addItem(cartId,productId,quantity) {
    await db.execute(
        `
        INSERT INTO cart_items
        (
            cart_id,
            product_id,
            quantity
        )
        VALUES (?, ?, ?)
        `,
        [ cartId, productId, quantity]

    );

}

export async function updateQuantity(cartId, productId,quantity) {

    await db.execute(

        `
        UPDATE cart_items
        SET quantity=?
        WHERE cart_id=? AND product_id=?
        `,
        [quantity,cartId,productId]

    );

}

export async function removeItem(cartId, productId){

    await db.execute(
        ` DELETE FROM cart_items
          WHERE cart_id = ? AND product_id = ? `,
        [cartId, productId]
    );

}