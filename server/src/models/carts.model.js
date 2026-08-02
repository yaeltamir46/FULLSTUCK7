import db from "../config/db.js";
import crypto from "crypto";

export async function findCartByUserId(userId,connection = db) {

    const [rows] = await connection.execute(
        ` 
        SELECT id
        FROM carts
        WHERE user_id = ?
        `,
        [userId]
    );

    return rows[0] || null;

}

export async function createCartForUser(userId,connection = db) {

    const cartId = crypto.randomUUID();
    await connection.execute(
        `
        INSERT INTO carts ( id, user_id)
        VALUES (?,?)
        `, [ cartId, userId]
    );

    return cartId;

}

export async function clear(cartId,connection = db){

    await connection.execute(
        `
        DELETE FROM cart_items
        WHERE cart_id = ?
        `,
        [cartId]
    );
}