import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares";
import { updateAboutPageSchema } from "../../schemas/about";
import { deleteFromCloudinaryByPublicId } from "../../utils/delete-image-by-public-id";

/**
 * PUT /about - Update about page (Admin/Super Admin only)
 * Handles atomic updates with optional banner image replacement
 */
export const updateAboutPageRoute = express.Router();

updateAboutPageRoute.put(
  "/",
  auth(["admin", "superadmin"]),
  validateZodSchema({ body: updateAboutPageSchema }),
  catchAsync(async (req, res, next) => {
    const updateData = req.body;

    // Get existing about page before transaction to check for old image
    const existingAboutPage = await db.aboutPage.findUnique({
      where: { id: 1 },
      include: { bannerImage: true },
    });

    // Handle atomic about page update with optional image replacement
    const result = await db.$transaction(async (tx) => {
      if (!existingAboutPage) {
        // Create about page if it doesn't exist
        let newImageRecord = null;
        if (updateData.bannerImage) {
          newImageRecord = await tx.image.create({
            data: {
              url: updateData.bannerImage.url,
              publicId: updateData.bannerImage.publicId,
              folder: updateData.bannerImage.folder || "app/about",
              altText: updateData.bannerImage.altText || "About page banner",
              width: updateData.bannerImage.width,
              height: updateData.bannerImage.height,
              format: updateData.bannerImage.format,
              size: updateData.bannerImage.size,
            },
          });
        }

        return await tx.aboutPage.create({
          data: {
            id: 1,
            introTitle: updateData.introTitle,
            introSubtitle: updateData.introSubtitle,
            heroText: updateData.heroText,
            bannerImageId: newImageRecord?.id,
            isActive: updateData.isActive ?? true,
          },
          include: {
            bannerImage: {
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
      }

      // Handle image replacement if new image is provided
      let newImageRecord = null;

      if (updateData.bannerImage) {
        // Delete old image record from database (if exists)
        if (existingAboutPage.bannerImage) {
          await tx.image.delete({
            where: { id: existingAboutPage.bannerImage.id },
          });
        }

        // Create new image record
        newImageRecord = await tx.image.create({
          data: {
            url: updateData.bannerImage.url,
            publicId: updateData.bannerImage.publicId,
            folder: updateData.bannerImage.folder || "app/about",
            altText: updateData.bannerImage.altText || "About page banner",
            width: updateData.bannerImage.width,
            height: updateData.bannerImage.height,
            format: updateData.bannerImage.format,
            size: updateData.bannerImage.size,
          },
        });
      }

      // Update the about page
      return await tx.aboutPage.update({
        where: { id: 1 },
        data: {
          introTitle: updateData.introTitle,
          introSubtitle: updateData.introSubtitle,
          heroText: updateData.heroText,
          bannerImageId: newImageRecord?.id,
          isActive: updateData.isActive,
        },
        include: {
          bannerImage: {
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
    });

    // Delete old image from Cloudinary after transaction (non-blocking)
    if (updateData.bannerImage && existingAboutPage?.bannerImage) {
      // Fire and forget - don't block the response
      deleteFromCloudinaryByPublicId(
        existingAboutPage.bannerImage.publicId,
        "image"
      )
        .then(() => {
          console.log(
            `Successfully deleted old about page banner: ${existingAboutPage.bannerImage?.publicId}`
          );
        })
        .catch((error) => {
          console.error(
            `Failed to delete old banner image from Cloudinary: ${error instanceof Error ? error.message : "Unknown error"}`
          );
          // Log error but don't fail the request since DB update succeeded
        });
    }

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "About page updated atomically with banner image management",
      data: result,
    });
  })
);
