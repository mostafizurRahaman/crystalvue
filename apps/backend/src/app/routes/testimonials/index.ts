import express from "express";
import { getAllTestimonialsRoute } from "./get-all-testimonials";
import { createTestimonialRoute } from "./create-testimonial";
import { updateTestimonialRoute } from "./update-testimonial";
import { deleteTestimonialRoute } from "./delete-testimonial";
import { getTestimonialDetailsRoute } from "./get-testimonial-details";
import { getBulkTestimonialsForExport } from "./get-testimonial-for-bulk-export";
import { auth } from "../../middlewares/auth";
import { validateZodSchema } from "../../middlewares";
import { getBulkTestimonialsQuerySchema } from "../../schemas/testimonials";

export const testimonialsRouter = express.Router();

// GET /testimonials/bulk/export - Get bulk testimonials for export (admin/superadmin only)
testimonialsRouter.get(
  "/bulk/export",
  auth(["admin", "superadmin"]),
  validateZodSchema({ query: getBulkTestimonialsQuerySchema }),
  getBulkTestimonialsForExport
);

// GET /testimonials - Get all testimonials (public access)
testimonialsRouter.get("/", getAllTestimonialsRoute);

// POST /testimonials - Create testimonial (admin/superadmin only)
testimonialsRouter.post("/", createTestimonialRoute);

// GET /testimonials/:id - Get single testimonial details (public access)
testimonialsRouter.get("/:id", getTestimonialDetailsRoute);

// PUT /testimonials/:id - Update testimonial (admin/superadmin only)
testimonialsRouter.put("/:id", updateTestimonialRoute);

// DELETE /testimonials/:id - Delete testimonial (admin/superadmin only)
testimonialsRouter.delete("/:id", deleteTestimonialRoute);

// Export individual routes for potential individual use
export {
  getAllTestimonialsRoute,
  createTestimonialRoute,
  updateTestimonialRoute,
  deleteTestimonialRoute,
  getTestimonialDetailsRoute,
  getBulkTestimonialsForExport,
};
