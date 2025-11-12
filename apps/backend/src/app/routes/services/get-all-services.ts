import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";

/**
 * Controller for retrieving paginated and filterable list of services
 * Supports filtering by categoryId, isActive, isPremium with pagination and sorting
 */
export const getAllServices = catchAsync(async (req: Request, res: Response) => {
    // Use validated query data if available, otherwise fall back to raw query
    const query =
      (req as any).validatedQuery ||
      (req.query as Record<string, string | number | boolean>);
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      categoryId,
      isActive,
      isPremium,
      search,
    } = query;

    const pageNum = Number(page);
    const limitNum = Math.min(Number(limit), 100); // Cap at 100 for performance
    const skip = (pageNum - 1) * limitNum;

    // Build where condition
    const where: Record<string, unknown> = {};

    if (categoryId) {
      where.parentCategoryId = categoryId as string;
    }

    if (typeof isActive === "boolean") {
      where.isActive = isActive;
    }

    if (typeof isPremium === "boolean") {
      where.isPremium = isPremium;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { tagline: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    // Valid sort fields for Service model
    const validSortFields = [
      "id",
      "parentCategoryId",
      "name",
      "tagline",
      "description",
      "price",
      "isPremium",
      "isActive",
      "createdAt",
      "updatedAt",
      "imageId",
    ];

    // Validate and sanitize sortBy
    const safeSortBy = validSortFields.includes(sortBy as string)
      ? (sortBy as string)
      : "createdAt";

    // Get total count for pagination
    const totalCount = await db.service.count({ where });

    // Get services with pagination and filters
    const services = await db.service.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: {
        [safeSortBy]: sortOrder as "asc" | "desc",
      },
      include: {
        parentCategory: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
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
        serviceAddons: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            addonText: true,
            sortOrder: true,
            isActive: true,
          },
        },
        _count: {
          select: {
            serviceAddons: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(totalCount / limitNum);

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Services retrieved successfully",
      data: services,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total_items: totalCount,
        total_pages: totalPages,
      },
    });
  }
);

export default getAllServices;
