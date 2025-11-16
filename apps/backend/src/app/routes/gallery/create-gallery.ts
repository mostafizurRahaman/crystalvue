import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares";
import {
  createGallerySchema,
  type CreateGalleryType,
} from "../../schemas/gallery";

/**
 * POST /gallery - Create a new gallery entry (Admin/Super Admin only)
 * Handles atomic creation of gallery image with optional category assignment
 */
export const createGalleryRoute = express.Router();

createGalleryRoute.post(
  "/",
  auth(["admin", "superadmin"]),
  validateZodSchema({ body: createGallerySchema }),
  catchAsync(async (req, res) => {
    const galleryData = req.body as CreateGalleryType;

    // Handle atomic gallery creation with image
    const result = await db.$transaction(async (tx) => {
      // Create image record first
      const imageRecord = await tx.image.create({
        data: {
          url: galleryData.image.url,
          publicId: galleryData.image.publicId,
          folder: galleryData.image.folder || "app/gallery",
          altText:
            galleryData.image.altText || galleryData.caption || "Gallery image",
          width: galleryData.image.width,
          height: galleryData.image.height,
          format: galleryData.image.format,
          size: galleryData.image.size,
        },
      });

      // Create gallery entry
      const gallery = await tx.gallery.create({
        data: {
          imageId: imageRecord.id,
          galleryCategory: galleryData.galleryCategory,
          caption: galleryData.caption,
          isActive: galleryData.isActive,
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

      return gallery;
    });

    sendApiResponse(res, {
      status: httpStatus.CREATED,
      success: true,
      message: "Gallery entry created successfully",
      data: result,
    });
  })
);

export default createGalleryRoute;
