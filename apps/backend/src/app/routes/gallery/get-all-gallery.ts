import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";

/**
 * GET /gallery - Get all gallery items (Public access)
 * Returns paginated gallery items with optional filtering
 */
export const getAllGalleryRoute = express.Router();

getAllGalleryRoute.get(
  "/",
  catchAsync(async (req, res, next) => {
    const {
      page = "1",
      limit = "10",
      galleryCategory,
      search,
    } = req.query as Record<string, string>;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || pageNum < 1) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid page number");
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Invalid limit (must be 1-100)"
      );
    }

    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    if (galleryCategory && galleryCategory !== "all") {
      where.galleryCategory = galleryCategory;
    }

    if (search) {
      where.caption = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [gallery, totalCount] = await Promise.all([
      db.gallery.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
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
      }),
      db.gallery.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    return sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      data: gallery,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total_pages: totalPages,
        total_items: totalCount,
      },
      message: "Gallery items retrieved successfully",
    });
  })
);

// Export the handler function for use in the router
export const getAllGallery = getAllGalleryRoute;
