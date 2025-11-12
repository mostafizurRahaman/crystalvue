// src/app/routes/sliders/get-all-sliders.ts
import express from "express";
import { z } from "zod";
import { catchAsync, sendApiResponse } from "../../utils";
import { db } from "../../db";
import status from "http-status";

const getAllSlidersRoute = express.Router();

// Define query parameter schema with Zod
const querySchema = z.object({
  search: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  sort_by: z
    .enum(["created_at", "updated_at", "orderNumber", "title", "isActive"])
    .default("orderNumber"),
  sort_order: z.enum(["asc", "desc"]).default("asc"),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  active_only: z.string().optional(),
});

getAllSlidersRoute.get(
  "/",
  catchAsync(async (req, res) => {
    // Parse and validate query parameters
    const result = querySchema.safeParse(req.query);

    if (!result.success) {
      return sendApiResponse(res, {
        status: status.BAD_REQUEST,
        success: false,
        message: "Invalid query parameters",
        data: result.error.format(),
      });
    }

    const {
      search,
      from_date,
      to_date,
      sort_by,
      sort_order,
      page,
      limit,
      active_only,
    } = result.data;

    // Build filters
    const filters: any = {};

    // Search filter (search across multiple fields)
    if (search) {
      filters.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { subtitle: { contains: search, mode: "insensitive" } },
        { buttonText: { contains: search, mode: "insensitive" } },
      ];
    }

    // Date filtering
    if (from_date && to_date) {
      filters.createdAt = {
        gte: new Date(from_date),
        lte: new Date(to_date),
      };
    } else if (from_date) {
      filters.createdAt = {
        gte: new Date(from_date),
      };
    } else if (to_date) {
      filters.createdAt = {
        lte: new Date(to_date),
      };
    }

    // Active filter
    if (active_only === "true") {
      filters.isActive = true;
    }

    // Build sort order
    const orderBy: any = {};
    if (sort_by === "title") {
      orderBy.title = sort_order;
    } else if (sort_by === "isActive") {
      orderBy.isActive = sort_order;
    } else if (sort_by === "created_at") {
      orderBy.createdAt = sort_order;
    } else if (sort_by === "updated_at") {
      orderBy.updatedAt = sort_order;
    } else {
      orderBy.orderNumber = sort_order;
    }

    // Get data with pagination
    const sliders = await db.heroSlider.findMany({
      where: Object.keys(filters).length > 0 ? filters : undefined,
      include: {
        image: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        modifiedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    // Count total items (for pagination)
    const totalItems = await db.heroSlider.count({
      where: Object.keys(filters).length > 0 ? filters : undefined,
    });

    sendApiResponse(res, {
      status: status.OK,
      success: true,
      message: "Sliders retrieved successfully",
      data: sliders,
      pagination: {
        page,
        limit,
        total_pages: Math.ceil(totalItems / limit),
        total_items: totalItems,
      },
    });
  }),
);

export default getAllSlidersRoute;
