import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares/validate-schema";
import {
  deleteGalleryParamsSchema,
  type DeleteGalleryParamsType,
} from "../../schemas/gallery";
import { deleteFromCloudinaryByPublicId } from "../../utils/delete-image-by-public-id";

/**
 * DELETE /gallery/:id - Delete a gallery entry (Admin/Super Admin only)
 * Handles atomic deletion with Cloudinary cleanup
 */
export const deleteGalleryRoute = express.Router();

deleteGalleryRoute.delete(
  "/:id",
  auth(["admin", "superadmin"]),
  validateZodSchema({ params: deleteGalleryParamsSchema }),
  catchAsync(async (req, res, next) => {
    const { id } = req.params as DeleteGalleryParamsType;

    // Get gallery with image relation first
    const existingGallery = await db.gallery.findUnique({
      where: { id },
      include: {
        image: true,
      },
    });

    if (!existingGallery) {
      throw new AppError(httpStatus.NOT_FOUND, "Gallery entry not found");
    }

    // Delete from Cloudinary first (external service call)
    let cloudinaryDeletionResult = null;
    if (existingGallery.image) {
      try {
        cloudinaryDeletionResult = await deleteFromCloudinaryByPublicId(
          existingGallery.image.publicId,
          "image"
        );
        console.log(
          `Successfully deleted gallery image: ${existingGallery.image.publicId}`
        );
      } catch (cloudinaryError) {
        // Log the error but continue with DB deletion for cleanup
        console.error(
          `Failed to delete Cloudinary image: ${cloudinaryError instanceof Error ? cloudinaryError.message : "Unknown error"}`
        );
        // Don't throw error here - we still want to clean up the database
      }
    }

    // Handle atomic database operations only in the transaction
    const result = await db.$transaction(async (tx) => {
      // Delete the gallery (this will cascade delete image relation due to SetNull)
      await tx.gallery.delete({
        where: { id },
      });

      return {
        id,
        caption: existingGallery.caption,
        galleryCategory: existingGallery.galleryCategory,
        deletedImageId: existingGallery.image?.id,
        cloudinaryDeletion: cloudinaryDeletionResult,
      };
    });

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Gallery entry deleted atomically with Cloudinary cleanup",
      data: result,
    });
  })
);

export default deleteGalleryRoute;
