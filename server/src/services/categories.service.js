import AppError from "../utils/AppError.js";


import {
    findAllActiveCategories,
    findActiveCategoriesPaginated,
    findActiveCategoryById,
    findActiveCategoryByName,
    insertCategory,
    updateCategoryById,
    hasActiveProducts,
    softDeleteCategory
} from "../models/categories.model.js";

export async function ensureCategoryExists(categoryId) {
    const category = await findActiveCategoryById(categoryId);

    if (!category) {
        throw new AppError(
            404,
            "CATEGORY_NOT_FOUND",
            "Category not found"
        );
    }

    return category;
}

async function ensureCategoryNameAvailable(name, excludedId = null) {

    const existingCategory = await findActiveCategoryByName(name, excludedId);

    if (existingCategory) {
        throw new AppError(
            409,
            "CATEGORY_ALREADY_EXISTS",
            "Category name already exists",
            {
                name: "Category name already exists"
            }
        );
    }
}

export async function getCategories(page, limit) {

    if (page === undefined && limit === undefined) {
        const categories = await findAllActiveCategories();

        return { categories };
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const { categories, totalItems } = await findActiveCategoriesPaginated(offset, limitNumber);

    return {
        categories,
        pagination: {
            page: pageNumber,
            limit: limitNumber,
            totalItems,
            totalPages:
                Math.ceil(totalItems / limitNumber)
        }
    };
}

export async function createCategory(data) {
    await ensureCategoryNameAvailable(data.name);

    try {
        return await insertCategory(data);
    } catch (error) {

        if (error.code === "ER_DUP_ENTRY") {
            throw new AppError(
                409,
                "CATEGORY_ALREADY_EXISTS",
                "Category name already exists",
                {
                    name: "Category name already exists"
                }
            );
        }

        throw error;
    }
}

export async function updateCategory(categoryId, changes) {
    await ensureCategoryExists(categoryId);

    if (changes.name !== undefined) {
        await ensureCategoryNameAvailable(
            changes.name,
            categoryId
        );
    }

    try {
        const affectedRows =
            await updateCategoryById(
                categoryId,
                changes
            );

        if (affectedRows === 0) {
            throw new AppError(
                404,
                "CATEGORY_NOT_FOUND",
                "Category not found"
            );
        }

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            throw new AppError(
                409,
                "CATEGORY_ALREADY_EXISTS",
                "Category name already exists",
                {
                    name: "Category name already exists"
                }
            );
        }

        throw error;
    }
}

export async function deleteCategory(categoryId) {
    await ensureCategoryExists(categoryId);

    const categoryInUse = await hasActiveProducts(categoryId);

    if (categoryInUse) {
        throw new AppError(
            409,
            "CATEGORY_IN_USE",
            "Category cannot be deleted while it contains active products"
        );
    }

    const affectedRows = await softDeleteCategory(categoryId);

    if (affectedRows === 0) {
        throw new AppError(
            404,
            "CATEGORY_NOT_FOUND",
            "Category not found"
        );
    }
}