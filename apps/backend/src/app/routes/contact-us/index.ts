import express from "express";
import { z } from "zod";
import { auth } from "../../middlewares/auth";
import { validateZodSchema } from "../../middlewares";
import {
  createContactUsSchema,
  getAllContactUsQuerySchema,
  getContactDetailsParamsSchema,
  getBulkContactForExportQuerySchema,
  updateContactStatusParamsSchema,
  updateContactStatusSchema,
  getContactByStatusQuerySchema,
  type CreateContactUsType,
  type GetAllContactUsQueryType,
  type GetContactDetailsParamsType,
  type GetBulkContactForExportQueryType,
  type UpdateContactStatusParamsType,
  type UpdateContactStatusType,
  type GetContactByStatusQueryType,
} from "../../schemas/contact-us";
import { getAllContacts } from "./get-all-contact";
import { createContact } from "./create-contact";
import { getContactDetails } from "./get-contact-details";
import { getBulkContactsForExport } from "./get-bulk-contact-for-export";
import { updateContactStatus } from "./update-contact-status";
import { getContactsByStatus } from "./get-contact-by-status";
import { deleteContact } from "./delete-contact";

export const contactUsRouter = express.Router();

// POST /contact-us/create - Create new contact entry
contactUsRouter.post(
  "/create",
  validateZodSchema({ body: createContactUsSchema }),
  createContact,
);

// GET /contact-us/get-all - Get all contact entries (paginated & filterable)
contactUsRouter.get(
  "/get-all",
  validateZodSchema({ query: getAllContactUsQuerySchema }),
  getAllContacts,
);

// GET /contact-us/get-bulk-for-export - Get selected entries for export
contactUsRouter.get(
  "/get-bulk-for-export",
  validateZodSchema({ query: getBulkContactForExportQuerySchema }),
  getBulkContactsForExport,
);

// GET /contact-us/:id - Get single contact details
contactUsRouter.get(
  "/:id",
  validateZodSchema({ params: getContactDetailsParamsSchema }),
  getContactDetails,
);

// PUT /contact-us/:id/status - Update contact entry status (admin/superadmin only)
contactUsRouter.put(
  "/:id/status",
  auth(["admin", "superadmin"]),
  validateZodSchema({
    params: updateContactStatusParamsSchema,
    body: updateContactStatusSchema,
  }),
  updateContactStatus,
);

// GET /contact-us/status/:status - Get contacts by status
contactUsRouter.get(
  "/status/:status",
  validateZodSchema({
    params: z.object({
      status: z.enum(["READY", "PENDING", "APPROVED", "REJECTED"]),
    }),
  }),
  getContactsByStatus,
);

// DELETE /contact-us/:id - Delete contact inquiry (admin/superadmin only)
contactUsRouter.delete("/:id", auth(["admin", "superadmin"]), deleteContact);

// Export individual routes for potential individual use
export {
  createContact,
  getAllContacts,
  getContactDetails,
  getBulkContactsForExport,
  updateContactStatus,
  getContactsByStatus,
  deleteContact,
};
