import {  getProducts as getProductsFromDB, findById } from "../models/products.model.js";

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