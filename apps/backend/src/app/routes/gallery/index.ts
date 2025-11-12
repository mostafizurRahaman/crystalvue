import express from "express";
import { getAllGallery } from "./get-all-gallery";
import { createGalleryRoute } from "./create-gallery";
import { updateGallery } from "./update-gallery";
import { deleteGalleryRoute } from "./delete-gallery";
import { getGalleryDetails } from "./get-gallery-details";
import { auth } from "../../middlewares/auth";

export const galleryRouter = express.Router();

// GET /gallery - Get all gallery entries (public access)
galleryRouter.get("/", getAllGallery);

// POST /gallery - Create gallery entry (admin/superadmin only)
galleryRouter.post("/", createGalleryRoute);

// GET /gallery/:id - Get single gallery entry details (public access)
galleryRouter.get("/:id", getGalleryDetails);

// PUT /gallery/:id - Update gallery entry (admin/superadmin only)
galleryRouter.put("/:id", updateGallery);

// DELETE /gallery/:id - Delete gallery entry (admin/superadmin only)
galleryRouter.delete("/:id", deleteGalleryRoute);

// Export individual routes for potential individual use
export {
  getAllGallery,
  createGalleryRoute,
  updateGallery,
  deleteGalleryRoute,
  getGalleryDetails,
};
