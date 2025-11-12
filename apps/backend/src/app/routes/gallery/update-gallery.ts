import express from "express";
import { z } from "zod";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import { updateGallerySchema } from "../../schemas/gallery";
import { validateZodSchema } from "../../middlewares/validate-schema";
import AppError from "../../classes/AppError";

/**
 * PUT /gallery/:id - Update gallery item (Admin/Super Admin only)
 */
export const updateGalleryRoute = express.Router();

updateGalleryRoute.put(
  "/:id",
  auth(["admin", "superadmin"]),
  validateZodSchema({
    params: z.object({ id: z.string().uuid("Invalid gallery item ID") }),
    body: updateGallerySchema,
  }),
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { caption, galleryCategory, isActive } = req.body;

    if (!id) {
      throw new AppError(httpStatus.BAD_REQUEST, "Gallery item ID is required");
    }

    // Check if gallery item exists
    const existingItem = await db.gallery.findUnique({
      where: { id },
    });

    if (!existingItem) {
      throw new AppError(httpStatus.NOT_FOUND, "Gallery item not found");
    }

    const updatedItem = await db.gallery.update({
      where: { id },
      data: {
        caption,
        galleryCategory,
        isActive,
      },
      include: {
        image: {
          select: {
            id: true,
            url: true,
            publicId: true,
            altText: true,
            width: true,
            height: true,
            format: true,
          },
        },
      },
    });

    return sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      data: { gallery: updatedItem },
      message: "Gallery item updated successfully",
    });
  })
);

// Export the handler function for use in the router
export const updateGallery = updateGalleryRoute;
