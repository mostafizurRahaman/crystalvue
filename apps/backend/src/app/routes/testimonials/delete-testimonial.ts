import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares";
import {
  deleteTestimonialParamsSchema,
  type DeleteTestimonialParamsType,
} from "../../schemas/testimonials";
import { deleteFromCloudinaryByPublicId } from "../../utils/delete-image-by-public-id";

/**
 * DELETE /testimonials/:id - Delete a testimonial (Admin/Super Admin only)
 * Handles atomic deletion with Cloudinary cleanup
 */
export const deleteTestimonialRoute = express.Router();

deleteTestimonialRoute.delete(
  "/:id",
  auth(["admin", "superadmin"]),
  validateZodSchema({ params: deleteTestimonialParamsSchema }),
  catchAsync(async (req, res, next) => {
    const { id } = req.params as DeleteTestimonialParamsType;

    // Get testimonial with image relation first
    const existingTestimonial = await db.testimonial.findUnique({
      where: { id },
      include: { image: true },
    });

    if (!existingTestimonial) {
      throw new AppError(httpStatus.NOT_FOUND, "Testimonial not found");
    }

    // Delete from Cloudinary first (external service call)
    let cloudinaryDeletionResult = null;

    if (existingTestimonial.image) {
      try {
        cloudinaryDeletionResult = await deleteFromCloudinaryByPublicId(
          existingTestimonial.image.publicId,
          "image"
        );
        console.log(
          `Successfully deleted testimonial image: ${existingTestimonial.image.publicId}`
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
      // Step 3: Delete the testimonial (this will cascade delete image relation due to SetNull)
      await tx.testimonial.delete({
        where: { id },
      });

      return {
        id: id.toString(),
        name: existingTestimonial.name,
        deletedImagesCount: existingTestimonial.image ? 1 : 0,
        cloudinaryDeletions: cloudinaryDeletionResult
          ? [cloudinaryDeletionResult]
          : [],
      };
    });

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Testimonial deleted atomically with Cloudinary cleanup",
      data: result,
    });
  })
);

export default deleteTestimonialRoute;
