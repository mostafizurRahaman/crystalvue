import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares";
import {
  updateTestimonialParamsSchema,
  updateTestimonialSchema,
  type UpdateTestimonialType,
  type UpdateTestimonialParamsType,
} from "../../schemas/testimonials";
import { deleteFromCloudinaryByPublicId } from "../../utils/delete-image-by-public-id";

/**
 * PUT /testimonials/:id - Update a testimonial (Admin/Super Admin only)
 * Handles atomic update with optional image replacement
 */
export const updateTestimonialRoute = express.Router();

updateTestimonialRoute.put(
  "/:id",
  auth(["admin", "superadmin"]),
  validateZodSchema({
    params: updateTestimonialParamsSchema,
    body: updateTestimonialSchema,
  }),
  catchAsync(async (req, res, next) => {
    const { id } = req.params as UpdateTestimonialParamsType;
    const updateData = req.body as UpdateTestimonialType;

    // Pre-prepare image data before transaction to minimize time in transaction
    let cloudinaryDeletionResult = null;
    const needsImageUpload = !!updateData.image;

    // If image update is needed, do Cloudinary work outside transaction first
    if (needsImageUpload) {
      // First check if testimonial exists and get current image info
      const existingTestimonial = await db.testimonial.findUnique({
        where: { id },
        include: { image: true },
      });

      if (!existingTestimonial) {
        throw new AppError(httpStatus.NOT_FOUND, "Testimonial not found");
      }

      // Delete old image from Cloudinary if it exists (outside transaction)
      if (existingTestimonial.image) {
        try {
          cloudinaryDeletionResult = await deleteFromCloudinaryByPublicId(
            existingTestimonial.image.publicId,
            "image"
          );
          console.log(
            `Successfully deleted old testimonial image: ${existingTestimonial.image.publicId}`
          );
        } catch (cloudinaryError) {
          // If Cloudinary deletion fails, fail the entire operation
          throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            `Failed to delete old image from Cloudinary: ${cloudinaryError instanceof Error ? cloudinaryError.message : "Unknown error"}`
          );
        }
      }
    }

    // Handle atomic testimonial update with pre-processed data
    const result = await db.$transaction(
      async (tx) => {
        // Check if testimonial exists again within transaction for data consistency
        const existingTestimonial = await tx.testimonial.findUnique({
          where: { id },
          include: { image: true },
        });

        if (!existingTestimonial) {
          throw new AppError(httpStatus.NOT_FOUND, "Testimonial not found");
        }

        let newImageRecord = null;

        // Step 1: Handle image replacement if new image is provided
        if (needsImageUpload && updateData.image) {
          // Delete old image record from database (fast operation)
          if (existingTestimonial.image) {
            await tx.image.delete({
              where: { id: existingTestimonial.image.id },
            });
          }

          // Create new image record (fast operation)
          newImageRecord = await tx.image.create({
            data: {
              url: updateData.image.url,
              publicId: updateData.image.publicId,
              folder: updateData.image.folder || "app/testimonials",
              altText:
                updateData.image.altText ||
                `Testimonial by ${updateData.name || existingTestimonial.name}`,
              width: updateData.image.width,
              height: updateData.image.height,
              format: updateData.image.format,
              size: updateData.image.size,
            },
          });
        }

        // Step 2: Update the testimonial (fast operation)
        const updatedTestimonial = await tx.testimonial.update({
          where: { id },
          data: {
            name: updateData.name,
            message: updateData.message,
            rating: updateData.rating,
            position: updateData.position,
            company: updateData.company,
            imageId: newImageRecord?.id,
            isActive: updateData.isActive,
          },
          include: {
            image: {
              select: {
                id: true,
                url: true,
                publicId: true,
                folder: true,
                altText: true,
                width: true,
                height: true,
                format: true,
                size: true,
                createdAt: true,
              },
            },
          },
        });

        return updatedTestimonial;
      },
      {
        timeout: 15000, // Increase timeout to 15 seconds
      }
    );

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Testimonial updated atomically with image management",
      data: result,
    });
  })
);

export default updateTestimonialRoute;
