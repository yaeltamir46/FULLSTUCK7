import {
    getProducts as getProductsService,
    getAdminProducts as getAdminProductsService,
    getProductById as getProduct,
    createProduct as createProductService,
    updateProduct as updateProductService,
    deleteProduct as deleteProductService
} from "../services/products.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";

export const getProducts = asyncHandler(async (req, res) => {

    const { page, limit } = req.validatedQuery;
    const result = await getProductsService(page, limit);

    res.status(200).json(
        {
            data: result.products,
            pagination: {
                page: result.page,
                limit: result.limit,
                totalItems: result.totalItems,
                totalPages: result.totalPages
            }
        });
})


export const getProductById = asyncHandler(async (req, res) => {
    const product = await getProduct(req.params.id);
    res.status(200).json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
    const imageUrl = req.file
        ? `/uploads/products/${req.file.filename}`
        : null;

        console.log({ ...req.body, imageUrl }); // Log the imageUrl to check its value
    const productId = await createProductService({ ...req.body, imageUrl });
    res.status(201).json({ id: productId });
});

export const updateProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0 && !req.file) {
    throw new AppError(
        400,
        "VALIDATION_ERROR",
        "At least one product field or image is required"
    );
}

    const changes = { ...req.body };

    if (req.file) {
        changes.imageUrl = `/uploads/products/${req.file.filename}`;
    }

    await updateProductService(req.params.id, changes);
    res.status(200).json({ message: "Product updated successfully" });

});

export const deleteProduct = asyncHandler(async (req, res) => {

    await deleteProductService(req.params.id);
    res.status(200).json({
        message: "Product deleted successfully"
    });
});

export const getAdminProducts = asyncHandler(async (req, res) => {

    const { page, limit } = req.validatedQuery;

    const result = await getAdminProductsService(page, limit);

    res.status(200).json({
        data: result.products,
        pagination: {
            page: result.page,
            limit: result.limit,
            totalItems: result.totalItems,
            totalPages: result.totalPages
        }
    });
});