import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import type { GetBulkContactForExportQueryType } from "../../schemas/contact-us";

/**
 * Controller for exporting selected contact entries by IDs
 * Returns all contact records matching the provided IDs
 */
export const getBulkContactsForExport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Use validated query data if available, otherwise fall back to raw query
    const query =
      (req as any).validatedQuery ||
      (req.query as unknown as GetBulkContactForExportQueryType);
    const { ids } = query;

    // Build where clause with only IDs
    const where: Record<string, unknown> = {};

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    // Fetch contacts for export with full details including relations
    const contacts = await db.contactUs.findMany({
      where,
      orderBy: { createdAt: "desc" },
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

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: `Retrieved ${contacts.length} contact entries for export`,
      data: contacts,
      summary: {
        total_count: contacts.length,
      },
    });
  }
);

export default getBulkContactsForExport;
