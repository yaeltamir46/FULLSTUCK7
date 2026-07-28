import db from "../config/db.js";

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