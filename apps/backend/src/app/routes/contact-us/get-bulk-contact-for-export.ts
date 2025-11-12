import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import type {
  GetBulkContactForExportQueryType,
  ContactWithRelations,
} from "../../schemas/contact-us";

/**
 * Controller for exporting selected contact entries
 * Supports filtering by criteria or specific IDs, capped at max limit for performance
 */
export const getBulkContactsForExport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Use validated query data if available, otherwise fall back to raw query
    const query =
      (req as any).validatedQuery ||
      (req.query as unknown as GetBulkContactForExportQueryType);
    const {
      ids,
      parentCategoryId,
      serviceId,
      startDate,
      endDate,
      limit = 100,
    } = query;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    if (parentCategoryId) {
      where.parentCategoryId = parentCategoryId;
    }

    if (serviceId) {
      where.serviceId = serviceId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        (where.createdAt as any).gte = startDate;
      }
      if (endDate) {
        (where.createdAt as any).lte = endDate;
      }
    }

    // Fetch contacts for export with full details including relations
    const contacts = await db.contactUs.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 1000), // Safety limit
      include: {
        parentCategory: {
          select: {
            id: true,
            name: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const totalCount = await db.contactUs.count({ where });

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: `Retrieved ${contacts.length} contact entries for export`,
      data: contacts,
      summary: {
        exported_count: contacts.length,
        total_available: totalCount,
      },
    });
  }
);

export default getBulkContactsForExport;
