import express from "express";
import { addCategoryAddonsRoute } from "./create-category-add-on";
import { removeCategoryAddonsRoute } from "./remove-category-add-on";
import { validateZodSchema } from "../../middlewares";
import {
  createCategoryAddOnParamsSchema,
  createCategoryAddOnBodySchema,
  removeCategoryAddOnParamsSchema,
  removeCategoryAddOnBodySchema,
} from "../../schemas/category-add-ons";
import { auth } from "../../middlewares/auth";

export const categoryAddOnsRouter = express.Router();

// POST /category-addons/:id/addons - Add category add-ons (admin/superadmin only)
categoryAddOnsRouter.post(
  "/:id/addons",
  auth(["admin", "superadmin"]),
  validateZodSchema({
    params: createCategoryAddOnParamsSchema,
    body: createCategoryAddOnBodySchema,
  }),
  addCategoryAddonsRoute,
);

// DELETE /category-addons/:id/addons - Remove category add-ons (admin/superadmin only)
categoryAddOnsRouter.delete(
  "/:id/addons",
  auth(["admin", "superadmin"]),
  validateZodSchema({
    params: removeCategoryAddOnParamsSchema,
    body: removeCategoryAddOnBodySchema,
  }),
  removeCategoryAddonsRoute,
);

// Export individual routes for potential individual use
export { addCategoryAddonsRoute, removeCategoryAddonsRoute };
