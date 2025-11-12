import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";

/**
 * GET /gallery/:id - Get single gallery item details
 */
export const getGalleryDetailsRoute = express.Router();

getGalleryDetailsRoute.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      throw new AppError(httpStatus.BAD_REQUEST, "Gallery item ID is required");
    }

    const galleryItem = await db.gallery.findUnique({
      where: { id },
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

    if (!galleryItem) {
      throw new AppError(httpStatus.NOT_FOUND, "Gallery item not found");
    }

    return sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      data: { gallery: galleryItem },
      message: "Gallery item details retrieved successfully",
    });
  })
);

// Export the handler function for use in the router
export const getGalleryDetails = getGalleryDetailsRoute;
