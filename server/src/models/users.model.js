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

export async function findById(userId,connection = db) {

    const [rows] = await connection.execute(
        `
        SELECT
            first_name AS firstName,
            last_name AS lastName,
            email,
            role,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM users
        WHERE id = ? AND deleted_at IS NULL AND is_active = TRUE
        `,
        [userId]
    );

    const user = rows[0] || null;

    return user;
}

export async function findByIdWithPassword( userId, connection = db) {

    const [rows] = await connection.execute(
        `
        SELECT
            u.id,
            u.role,
            u.is_active AS isActive,
            up.password_hash AS passwordHash

        FROM users u

        INNER JOIN user_passwords up
            ON up.user_id = u.id

        WHERE
            u.id = ?
            AND u.deleted_at IS NULL
        `,
        [userId]
    );

    const user = rows[0] || null;

    if (user) {
        user.isActive = Boolean(user.isActive);
    }

    return user;
}

export async function updatePassword(userId,passwordHash,connection = db) {

    const [result] = await connection.execute(
        `
        UPDATE user_passwords
        SET password_hash = ?
        WHERE user_id = ?
        `,
        [passwordHash,userId]
    );

    return result.affectedRows > 0;
}
export async function findAllUsers(limit, offset, connection = db) {

    const limitNumber = Number(limit);
    const offsetNumber = Number(offset);

    const [rows] = await connection.execute(
        `
        SELECT
            id,
            first_name AS firstName,
            last_name AS lastName,
            email,
            role,
            is_active AS isActive,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM users
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
        LIMIT ${limitNumber} OFFSET ${offsetNumber}
        `
        // [limitNumber, offsetNumber]
    );

    const [countRows] = await connection.execute(
        `
        SELECT COUNT(*) AS totalItems
        FROM users
        WHERE deleted_at IS NULL
        `
    );

    const users = rows.map(user => ({
        ...user,
        isActive: Boolean(user.isActive)
    }));

    return {
        users,
        totalItems: Number(countRows[0].totalItems)
    };
}

export async function findUserByIdForAdmin(userId, connection = db) {

    const [rows] = await connection.execute(
        `
        SELECT
            id,
            role,
            is_active AS isActive
        FROM users
        WHERE
            id = ?
            AND deleted_at IS NULL
        `,
        [userId]
    );

    const user = rows[0] || null;

    if (user) {
        user.isActive = Boolean(user.isActive);
    }

    return user;
}

export async function updateStatus(userId, isActive, connection = db) {

    const [result] = await connection.execute(
        `
        UPDATE users
        SET is_active = ?
        WHERE
            id = ?
            AND deleted_at IS NULL
        `,
        [isActive, userId]
    );

    return result.affectedRows > 0;
}

export async function findUserForAuthentication(userId, connection = db) {

    const [rows] = await connection.execute(
        `
        SELECT
            id,
            role,
            is_active AS isActive
        FROM users
        WHERE
            id = ?
            AND deleted_at IS NULL
        `,
        [userId]
    );

    const user = rows[0] || null;

    if (user) {
        user.isActive = Boolean(user.isActive);
    }

    return user;
}