import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares";
import {
  createTestimonialSchema,
  type CreateTestimonialType,
} from "../../schemas/testimonials";
import { deleteFromCloudinaryByPublicId } from "../../utils/delete-image-by-public-id";

/**
 * POST /testimonials - Create a new testimonial (Admin/Super Admin only)
 * Handles atomic creation of testimonial with optional image
 */
export const createTestimonialRoute = express.Router();

createTestimonialRoute.post(
  "/",
  auth(["admin", "superadmin"]),
  validateZodSchema({ body: createTestimonialSchema }),
  catchAsync(async (req, res, next) => {
    const testData = req.body as CreateTestimonialType;

    // Handle atomic testimonial creation with image
    const result = await db.$transaction(async (tx) => {
      let imageRecord = null;

      // If image data is provided, create image record first
      if (testData.image) {
        imageRecord = await tx.image.create({
          data: {
            url: testData.image.url,
            publicId: testData.image.publicId,
            folder: testData.image.folder || "app/testimonials",
            altText:
              testData.image.altText || `Testimonial by ${testData.name}`,
            width: testData.image.width,
            height: testData.image.height,
            format: testData.image.format,
            size: testData.image.size,
          },
        });
      }

      // Create the testimonial
      const testimonial = await tx.testimonial.create({
        data: {
          name: testData.name,
          message: testData.message,
          rating: testData.rating,
          position: testData.position,
          company: testData.company,
          imageId: imageRecord?.id,
          isActive: testData.isActive,
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

      return testimonial;
    });

    sendApiResponse(res, {
      status: httpStatus.CREATED,
      success: true,
      message: "Testimonial created successfully",
      data: result,
    });
  })
);

export default createTestimonialRoute;
