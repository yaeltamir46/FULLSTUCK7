import { getProducts as getProductsService } from "../services/products.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProducts = asyncHandler(async (req, res) => {

    const { page, limit } = req.query;
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