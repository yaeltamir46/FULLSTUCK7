import { randomUUID } from "crypto";
import  db  from "../config/db.js";

function mapCategory(category) {
    return {
        ...category,
        isActive: Boolean(category.isActive)
    };
}

export async function findAllActiveCategories() {
    const [rows] = await db.execute(
        `
        SELECT
            id,
            name,
            description,
            is_active AS isActive,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM categories
        WHERE deleted_at IS NULL
        ORDER BY name ASC
        `
    );

    return rows.map(mapCategory);
}

export async function findActiveCategoriesPaginated(offset,limit) {
    const offsetNumber = Number(offset);
    const limitNumber = Number(limit);

    const [rows] = await db.execute(
        `
        SELECT
            id,
            name,
            description,
            is_active AS isActive,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM categories
        WHERE deleted_at IS NULL
        ORDER BY name ASC
        LIMIT ${limitNumber} OFFSET ${offsetNumber}
        `
        
    );

    const [countRows] = await db.execute(
        `
        SELECT COUNT(*) AS totalItems
        FROM categories
        WHERE
            is_active = TRUE
            AND deleted_at IS NULL
        `
    );

    return {
        categories: rows.map(mapCategory),
        totalItems: Number(countRows[0].totalItems)
    };
}

export async function findActiveCategoryById(categoryId) {

    const [rows] = await db.execute(
        `
        SELECT id, name, description
        FROM categories
        WHERE
            id = ?
            AND is_active = TRUE
            AND deleted_at IS NULL
        `,
        [categoryId]
    );

    return rows[0]
        ? mapCategory(rows[0])
        : null;
}


export async function findActiveCategoryByName(name,excludedId = null) {
    let sql = `
        SELECT id
        FROM categories
        WHERE
            name = ?
            AND is_active = TRUE
            AND deleted_at IS NULL
    `;

    const values = [name];

    if (excludedId) {
        sql += ` AND id <> ?`;
        values.push(excludedId);
    }

    const [rows] = await db.execute(sql, values);

    return rows[0] || null;
}

export async function insertCategory({name,description = null}) {
    const id = randomUUID();

    await db.execute(
        `
        INSERT INTO categories (
            id,
            name,
            description
        )
        VALUES (?, ?, ?)
        `,
        [id, name, description]
    );

    return id;
}

export async function updateCategoryById(categoryId,changes) {
    const fields = [];
    const values = [];

    if (changes.name !== undefined) {
        fields.push("name = ?");
        values.push(changes.name);
    }

    if (changes.description !== undefined) {
        fields.push("description = ?");
        values.push(changes.description);
    }

    values.push(categoryId);

    const [result] = await db.execute(
        `
        UPDATE categories
        SET ${fields.join(", ")}
        WHERE
            id = ?
            AND is_active = TRUE
            AND deleted_at IS NULL
        `,
        values
    );

    return result.affectedRows;
}

export async function hasActiveProducts(categoryId) {
    const [rows] = await db.execute(
        `
        SELECT EXISTS (
            SELECT 1
            FROM products
            WHERE
                category_id = ?
                AND is_active = TRUE
                AND deleted_at IS NULL
        ) AS categoryInUse
        `,
        [categoryId]
    );

    return Boolean(rows[0].categoryInUse);
}

export async function softDeleteCategory(categoryId) {
    const [result] = await db.execute(
        `
        UPDATE categories
        SET
            is_active = FALSE,
            deleted_at = CURRENT_TIMESTAMP
        WHERE
            id = ?
            AND is_active = TRUE
            AND deleted_at IS NULL
        `,
        [categoryId]
    );

    return result.affectedRows;
}



async function ensureCategoryExists(categoryId) {

    const category = await findActiveCategoryById(categoryId);
    if (!category) {
        throw new AppError(
            404,
            "CATEGORY_NOT_FOUND",
            "Category not found"
        );
    }
}