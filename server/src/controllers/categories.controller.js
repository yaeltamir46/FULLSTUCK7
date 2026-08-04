import {asyncHandler} from "../utils/asyncHandler.js";

import {
    getCategories as getCategoriesService,
    createCategory as createCategoryService,
    updateCategory as updateCategoryService,
    deleteCategory as deleteCategoryService
} from "../services/categories.service.js";

export const getCategories = asyncHandler(async (req, res) => {
        const { page, limit } = req.validatedQuery;

        const result = await getCategoriesService(page, limit);

        res.status(200).json({data: result});
    }
);

export const createCategory = asyncHandler(async (req, res) => {
        const categoryId = await createCategoryService(req.body);
        res.status(201).json( { id: categoryId });
    }
);

export const updateCategory = asyncHandler(async (req, res) => {
    await updateCategoryService( req.params.id,req.body);
    res.status(200).json({message: "Category updated successfully"});
});

export const deleteCategory = asyncHandler( async (req, res) => {
        await deleteCategoryService(req.params.id);
        res.status(200).json({message: "Category deleted successfully"});
    }
);

