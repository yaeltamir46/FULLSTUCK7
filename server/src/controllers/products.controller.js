import { getProducts as getProductsService, getProductById as getProduct} from "../services/products.service.js";
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


export const getProductById = asyncHandler(async (req, res) => {
    const product = await getProduct(req.params.id);
    res.status(200).json( product);
});