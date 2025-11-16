import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares/validate-schema";
import { updateSettingsSchema } from "../../schemas/settings";

/**
 * POST /settings - Create initial global settings (Admin/Super Admin only)
 * Use this endpoint to initialize settings for the first time
 */
export const postSettingsRoute = express.Router();

postSettingsRoute.post(
  "/",
  auth(["admin", "superadmin"]),
  validateZodSchema({ body: updateSettingsSchema }),
  catchAsync(async (req, res, next) => {
    // Check if settings already exist
    const existingSettings = await db.globalSettings.findUnique({
      where: { id: 1 },
    });

    if (existingSettings) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Global settings already exist. Use PUT /settings to update existing settings."
      );
    }

    const settingsData = req.body;
    const { logoImage, faviconImage, metaImage, ...restData } = settingsData;

    // Create settings with optional images
    const result = await db.$transaction(async (tx) => {
      // Create images if provided
      let logoImageRecord = null;
      let faviconImageRecord = null;
      let metaImageRecord = null;

      if (logoImage) {
        logoImageRecord = await tx.image.create({
          data: {
            url: logoImage.url,
            publicId: logoImage.publicId,
            folder: logoImage.folder || "app/settings",
            altText: logoImage.altText,
            width: logoImage.width,
            height: logoImage.height,
            format: logoImage.format,
            size: logoImage.size,
          },
          select: { id: true, url: true, publicId: true },
        });
      }

      if (faviconImage) {
        faviconImageRecord = await tx.image.create({
          data: {
            url: faviconImage.url,
            publicId: faviconImage.publicId,
            folder: faviconImage.folder || "app/settings",
            altText: faviconImage.altText,
            width: faviconImage.width,
            height: faviconImage.height,
            format: faviconImage.format,
            size: faviconImage.size,
          },
          select: { id: true, url: true, publicId: true },
        });
      }

      if (metaImage) {
        metaImageRecord = await tx.image.create({
          data: {
            url: metaImage.url,
            publicId: metaImage.publicId,
            folder: metaImage.folder || "app/settings",
            altText: metaImage.altText,
            width: metaImage.width,
            height: metaImage.height,
            format: metaImage.format,
            size: metaImage.size,
          },
          select: { id: true, url: true, publicId: true },
        });
      }

      // Create settings record
      const settings = await tx.globalSettings.create({
        data: {
          ...restData,
          logoImageId: logoImageRecord?.id,
          faviconImageId: faviconImageRecord?.id,
          metaImageId: metaImageRecord?.id,
          isActive: restData.isActive ?? true,
        },
        include: {
          logoImage: {
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
          faviconImage: {
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
          metaImage: {
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

      return settings;
    });

    return sendApiResponse(res, {
      status: httpStatus.CREATED,
      success: true,
      message: "Global settings created successfully",
      data: result,
    });
  }),
);
