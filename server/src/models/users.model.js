import db from "../config/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { transactionHandler } from "../utils/transactionHandler.js";

export async function findByEmail(email){
    const [rows] = await db.execute(
        `
        SELECT
            id,
            u.first_name AS firstName,
            u.last_name AS lastName,
            email,
            up.password_hash AS passwordHash,
            role,
            is_active AS isActive
        FROM users u join user_passwords up on u.id = up.user_id
        WHERE u.email = ?
        `,
        [email]
    );
    return rows[0] || null;
}


export async function createUser(firstName, lastName, email, password) {
    
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();
    
    return await transactionHandler(async (connection) => {
    
        await connection.execute(
        `
        INSERT INTO users ( id,first_name,last_name,email,role)
        VALUES (?,?,?,?,'customer')`,
        [
            userId,
            firstName,
            lastName,
            email
        ]
         );

        await connection.execute(
            `
            INSERT INTO user_passwords (user_id,password_hash) 
            VALUES(?,?)`,
            [
                userId,
                passwordHash
            ]
        );

        return userId;
    })
}