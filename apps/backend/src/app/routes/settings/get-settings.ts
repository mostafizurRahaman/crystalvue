import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";

/**
 * GET /settings - Get global settings (Public access)
 * Returns site-wide configuration settings
 */
export const getSettingsRoute = express.Router();

getSettingsRoute.get(
  "/",
  catchAsync(async (req, res, next) => {
    // GET endpoints should only retrieve data, never create or modify it
    // Find existing settings only - do not create if it doesn't exist
    const settings = await db.globalSettings.findUnique({
      where: { id: 1 },
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

    // If settings don't exist, return default settings structure
    if (!settings) {
      return sendApiResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Global settings retrieved (default structure)",
        data: {
          id: 1,
          siteTitle: null,
          siteDescription: null,
          logoImage: null,
          faviconImage: null,
          metaImage: null,
          contactEmail: null,
          contactPhone: null,
          contactWhatsApp: null,
          officeAddress: null,
          googleMapEmbedCode: null,
          socialMediaLinks: null,
          businessHours: null,
          seoMetaTitle: null,
          seoMetaDescription: null,
          seoKeywords: null,
          isActive: true,
        },
      });
    }

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Global settings retrieved successfully",
      data: settings,
    });
  }),
);
