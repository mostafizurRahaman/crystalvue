import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import { validateZodSchema } from "../../middlewares";
import {
  getAllTestimonialsQuerySchema,
  type GetAllTestimonialsQueryType,
} from "../../schemas/testimonials";

/**
 * GET /testimonials - Get all testimonials with filtering and pagination (Public access)
 * Public endpoint for fetching testimonials
 */
export const getAllTestimonialsRoute = express.Router();

getAllTestimonialsRoute.get(
  "/",
  validateZodSchema({ query: getAllTestimonialsQuerySchema }),
  catchAsync(async (req, res) => {
    // Use validated query data if available, otherwise fall back to raw query
    const queryData =
      (req as any).validatedQuery ||
      (req.query as unknown as GetAllTestimonialsQueryType);

    // Build where conditions for filtering
    const whereConditions: any = {};

    if (queryData.isActive !== undefined) {
      whereConditions.isActive = queryData.isActive;
    } else {
      // By default, only return active testimonials for public access
      whereConditions.isActive = true;
    }

    if (queryData.search) {
      whereConditions.OR = [
        { name: { contains: queryData.search, mode: "insensitive" } },
        { message: { contains: queryData.search, mode: "insensitive" } },
        { position: { contains: queryData.search, mode: "insensitive" } },
        { company: { contains: queryData.search, mode: "insensitive" } },
      ];
    }

    if (queryData.rating) {
      whereConditions.rating = queryData.rating;
    }

    // Get total count for pagination
    const totalTestimonials = await db.testimonial.count({
      where: whereConditions,
    });

    // Calculate pagination
    const skip = (queryData.page - 1) * queryData.limit;

    // Get testimonials with pagination and sorting
    const testimonials = await db.testimonial.findMany({
      where: whereConditions,
      skip,
      take: queryData.limit,
      orderBy: {
        [queryData.sortBy]: queryData.sortOrder,
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
          },
        },
      },
    });

    // Return paginated response
    const totalPages = Math.ceil(totalTestimonials / queryData.limit);

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Testimonials retrieved successfully",
      data: testimonials,
      pagination: {
        limit: queryData.limit,
        page: queryData.page,
        total_pages: totalPages,
        total_items: totalTestimonials,
      },
    });
  })
);
