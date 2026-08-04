import { randomUUID } from "crypto";
import AppError from "../utils/AppError.js";
import {ensureCategoryExists} from "../services/categories.service.js"

import {
    getProducts as getProductsFromDB,
    getAdminProducts as getAdminProductsFromDB,
    findById,
    insertProduct,
    updateProductById,
    softDeleteProduct
} from "../models/products.model.js";

export async function getProducts(page = 1, limit = 12) {

    const offset = (page - 1) * limit;
    const { products, totalItems } = await getProductsFromDB(offset, limit);

    return {
        products,
        page: Number(page),
        limit: Number(limit),
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
    };

}

export async function getAdminProducts(page = 1, limit = 12) {

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const { products, totalItems } =
        await getAdminProductsFromDB(offset, limitNumber);

    return {
        products,
        page: pageNumber,
        limit: limitNumber,
        totalItems,
        totalPages: Math.ceil(totalItems / limitNumber)
    };
}

export async function getProductById(productId) {

    const product = await findById(productId);
    if (!product) {
        throw new AppError(
            404,
            "PRODUCT_NOT_FOUND",
            "Product not found"
        );
    }

    return product;

}

//TODO: move this to category model and service
// async function ensureCategoryExists(categoryId) {

//     const category = await findActiveCategoryById(categoryId);
//     if (!category) {
//         throw new AppError(
//             404,
//             "CATEGORY_NOT_FOUND",
//             "Category not found"
//         );
//     }
// }

export async function createProduct(productData) {

    await ensureCategoryExists(productData.categoryId);

    const productId = randomUUID();

    await insertProduct({
        id: productId,
        ...productData
    });

    return productId;
}

export async function updateProduct(productId, changes) {

    const existingProduct = await findById(productId);

    if (!existingProduct) {
        throw new AppError(
            404,
            "PRODUCT_NOT_FOUND",
            "Product not found"
        );
    }

    if (changes.categoryId !== undefined) {
        await ensureCategoryExists(changes.categoryId);
    }

    await updateProductById(productId, changes);
}

export async function deleteProduct(productId) {

    const existingProduct = await findById(productId);

    if (!existingProduct) {
        throw new AppError(
            404,
            "PRODUCT_NOT_FOUND",
            "Product not found"
        );
    }

    await softDeleteProduct(productId);
}

