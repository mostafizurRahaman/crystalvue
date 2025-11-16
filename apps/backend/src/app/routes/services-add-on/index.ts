import express from "express";
import { addServiceAddon } from "./add-service-addon";
import { removeServiceAddon } from "./remove-service-addon";
import { validateZodSchema } from "../../middlewares";
import {
  addServiceAddonSchema,
  removeServiceAddonParamsSchema,
  removeServiceAddonQuerySchema,
} from "../../schemas/services-add-on";
import { auth } from "../../middlewares/auth";

export const servicesAddOnRouter = express.Router();

// POST /services/addons - Add service add-on (admin/superadmin only)
servicesAddOnRouter.post(
  "/",
  auth(["admin", "superadmin"]),
  validateZodSchema({ body: addServiceAddonSchema }),
  addServiceAddon
);

// DELETE /services/addons/:id - Remove service add-on by ID (admin/superadmin only)
servicesAddOnRouter.delete(
  "/:id",
  auth(["admin", "superadmin"]),
  validateZodSchema({
    params: removeServiceAddonParamsSchema,
  }),
  removeServiceAddon
);

// Export individual routes for potential individual use
export { addServiceAddon, removeServiceAddon };
