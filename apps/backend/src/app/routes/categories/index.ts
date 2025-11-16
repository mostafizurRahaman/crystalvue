import express from "express";
import { getAllCategoriesRoute } from "./get-all-categories";
import { createCategoryRoute } from "./create-category";
import { updateCategoryRoute } from "./update-categories";
import { deleteCategoryRoute } from "./delete-categories";
import { getSingleCategoryRoute } from "./get-category-details";
import { getBulkCategoriesRoute } from "./get-bulk-category-detail-for-export";
import { validateZodSchema } from "../../middlewares";
import {
  createCategorySchema,
  getAllCategoriesQuerySchema,
  updateCategoryParamsSchema,
  updateCategorySchema,
  deleteCategoryParamsSchema,
  getCategoryDetailsParamsSchema,
  getBulkCategoriesQuerySchema,
} from "../../schemas/categories";
import { auth } from "../../middlewares/auth";

export const categoriesRouter = express.Router();

// GET /categories/bulk/export - Get bulk category details for export (admin/superadmin only)
categoriesRouter.get(
  "/bulk/export",
  auth(["admin", "superadmin"]),
  validateZodSchema({ query: getBulkCategoriesQuerySchema }),
  getBulkCategoriesRoute
);

// GET /categories - Get all categories (public access)
categoriesRouter.get(
  "/",
  validateZodSchema({ query: getAllCategoriesQuerySchema }),
  getAllCategoriesRoute
);

// POST /categories - Create category (admin/superadmin only)
categoriesRouter.post(
  "/",
  auth(["admin", "superadmin"]),
  validateZodSchema({ body: createCategorySchema }),
  createCategoryRoute
);

// PUT /categories/:id - Update category (admin/superadmin only)
categoriesRouter.put(
  "/:id",
  auth(["admin", "superadmin"]),
  validateZodSchema({
    params: updateCategoryParamsSchema,
    body: updateCategorySchema,
  }),
  updateCategoryRoute
);

// DELETE /categories/:id - Delete category (admin/superadmin only)
categoriesRouter.delete(
  "/:id",
  auth(["admin", "superadmin"]),
  validateZodSchema({ params: deleteCategoryParamsSchema }),
  deleteCategoryRoute
);

// GET /categories/:id - Get single category details
categoriesRouter.get(
  "/:id",
  validateZodSchema({ params: getCategoryDetailsParamsSchema }),
  getSingleCategoryRoute
);

// Export individual routes for potential individual use
export {
  getBulkCategoriesRoute,
  getAllCategoriesRoute,
  createCategoryRoute,
  updateCategoryRoute,
  deleteCategoryRoute,
  getSingleCategoryRoute,
};
