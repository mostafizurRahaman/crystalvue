import express from "express";
import { getAllServices } from "./get-all-services";
import { createServices } from "./create-services";
import { updateServices } from "./update-services";
import { deleteServices } from "./delete-services";
import { getServiceDetails } from "./get-service-details";
import { getBulkServicesForExport } from "./get-bulk-services-for-export";
import { validateZodSchema } from "../../middlewares";
import {
  createServiceSchema,
  getAllServicesQuerySchema,
  updateServiceParamsSchema,
  updateServiceSchema,
  deleteServiceParamsSchema,
  getServiceDetailsParamsSchema,
  getBulkServicesQuerySchema,
} from "../../schemas/services";
import { auth } from "../../middlewares/auth";

export const servicesRouter = express.Router();

// GET /services/bulk/export - Get bulk services for export (admin/superadmin only)
servicesRouter.get(
  "/bulk/export",
  auth(["admin", "superadmin"]),
  validateZodSchema({ query: getBulkServicesQuerySchema }),
  getBulkServicesForExport
);

// GET /services - Get all services (public access)
servicesRouter.get(
  "/",
  validateZodSchema({ query: getAllServicesQuerySchema }),
  getAllServices
);

// POST /services - Create service (admin/superadmin only)
servicesRouter.post(
  "/",
  auth(["admin", "superadmin"]),
  validateZodSchema({ body: createServiceSchema }),
  createServices
);

// PUT /services/:id - Update service (admin/superadmin only)
servicesRouter.put(
  "/:id",
  auth(["admin", "superadmin"]),
  validateZodSchema({
    params: updateServiceParamsSchema,
    body: updateServiceSchema,
  }),
  updateServices
);

// DELETE /services/:id - Delete service (admin/superadmin only)
servicesRouter.delete(
  "/:id",
  auth(["admin", "superadmin"]),
  validateZodSchema({ params: deleteServiceParamsSchema }),
  deleteServices
);

// GET /services/:id - Get single service details
servicesRouter.get(
  "/:id",
  validateZodSchema({ params: getServiceDetailsParamsSchema }),
  getServiceDetails
);

// Export individual routes for potential individual use
export {
  getAllServices,
  createServices,
  updateServices,
  deleteServices,
  getServiceDetails,
  getBulkServicesForExport,
};
