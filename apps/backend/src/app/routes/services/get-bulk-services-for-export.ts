import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";

/**
 * Controller for exporting large sets of services
 * Supports filtering by criteria or specific IDs, capped at max limit for performance
 */
export const getBulkServicesForExport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      ids,
      categoryId,
      isActive,
      isPremium,
      limit = 1000, // Default limit for export
      search,
    } = req.query as Record<string, string | number | boolean>;

    const maxLimit = Math.min(Number(limit), 5000); // Cap at 5000 for performance
    const whereClause: Record<string, unknown> = {};

    // If specific IDs are provided, use them
    if (ids && typeof ids === "string" && ids.trim()) {
      const idArray = ids
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
      if (idArray.length > 0) {
        whereClause.id = { in: idArray };
      }
    } else {
      // Build filters only if no specific IDs
      if (categoryId) {
        whereClause.parentCategoryId = categoryId as string;
      }

      if (typeof isActive === "boolean") {
        whereClause.isActive = isActive;
      }

      if (typeof isPremium === "boolean") {
        whereClause.isPremium = isPremium;
      }

      if (search) {
        whereClause.OR = [
          { name: { contains: search as string, mode: "insensitive" } },
          { tagline: { contains: search as string, mode: "insensitive" } },
          { description: { contains: search as string, mode: "insensitive" } },
        ];
      }
    }

    // Get total count (important for export operations)
    const totalCount = await db.service.count({ where: whereClause });

    // Fetch services with optimized includes for export
    const services = await db.service.findMany({
      where: whereClause,
      take: maxLimit,
      orderBy: [{ parentCategory: { name: "asc" } }, { name: "asc" }],
      include: {
        parentCategory: {
          select: {
            id: true,
            name: true,
            isActive: true,
            isPremium: true,
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
      },
    });

    // Add summary information for export
    const summary = {
      total_exported: services.length,
      total_available: totalCount,
      has_more: totalCount > maxLimit,
      filters_applied: {
        by_ids: !!ids,
        by_category: !!categoryId,
        by_status: isActive !== undefined,
        by_premium: isPremium !== undefined,
        search_term: search || null,
      },
    };

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Bulk services export retrieved successfully",
      data: services,
      summary,
    });
  }
);

export default getBulkServicesForExport;
