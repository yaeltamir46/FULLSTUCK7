import db from "../config/db.js";
import crypto from "crypto";

export async function findCartByUserId(userId) {

    const [rows] = await db.execute(
        ` 
        SELECT id
        FROM carts
        WHERE user_id = ?
        `,
        [userId]
    );

    return rows[0] || null;

}

export async function createCartForUser(userId) {

    const cartId = crypto.randomUUID();
    await db.execute(
        `
        INSERT INTO carts ( id, user_id)
        VALUES (?,?)
        `, [ cartId, userId]
    );

    return cartId;

}

export async function clear(cartId){

    await db.execute(
        `
        DELETE FROM cart_items
        WHERE cart_id = ?
        `,
        [cartId]
    );
}