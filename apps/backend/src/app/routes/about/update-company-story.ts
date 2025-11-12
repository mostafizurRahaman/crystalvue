import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import { updateCompanyStorySchema } from "../../schemas/about";
import { validateZodSchema } from "../../middlewares/validate-schema";
import AppError from "../../classes/AppError";
import { handleImageSave } from "../../utils/image-helpers";

/**
 * PUT /about/story - Update company story (Admin/Super Admin only)
 */
export const updateCompanyStoryRoute = express.Router();

updateCompanyStoryRoute.put(
  "/",
  auth(["admin", "superadmin"]),
  validateZodSchema({ body: updateCompanyStorySchema }),
  catchAsync(async (req, res, next) => {
    const { title, content, leftImage, isActive } = req.body;

    // Get existing company story before transaction to avoid extra queries inside
    const existingCompanyStory = await db.companyStory.findUnique({
      where: { aboutPageId: 1 },
      include: { leftImage: true },
    });

    // Handle image save outside transaction to determine image ID
    const leftImageId = await handleImageSave(
      existingCompanyStory?.leftImageId,
      leftImage,
      undefined // No transaction client - use regular db
    );

    // Now do the upsert in a transaction (fast database operations only)
    const companyStory = await db.companyStory.upsert({
      where: { aboutPageId: 1 },
      update: {
        title,
        content,
        leftImageId,
        isActive,
      },
      create: {
        aboutPageId: 1,
        title,
        content,
        leftImageId,
        isActive: true,
      },
      include: {
        leftImage: {
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

    // Clean up old image from Cloudinary after transaction (non-blocking)
    // Only delete if we had old image and new image was provided
    if (leftImage && existingCompanyStory?.leftImage?.publicId) {
      // Check if image actually changed
      if (!leftImage.id || leftImage.id !== existingCompanyStory.leftImageId) {
        const { deleteFromCloudinaryByPublicId } = await import(
          "../../utils/delete-image-by-public-id"
        );

        // Delete old image from Cloudinary (fire and forget)
        deleteFromCloudinaryByPublicId(existingCompanyStory.leftImage.publicId, "image")
          .then(() => {
            console.log(
              `Successfully deleted old company story image: ${existingCompanyStory.leftImage?.publicId}`
            );
          })
          .catch((error) => {
            console.error(
              `Failed to delete old company story image from Cloudinary: ${error instanceof Error ? error.message : "Unknown error"}`
            );
          });
      }
    }

    return sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      data: { companyStory },
      message: "Company story updated successfully",
    });
  }),
);
