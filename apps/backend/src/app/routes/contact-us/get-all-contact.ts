import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import type { GetAllContactUsQueryType } from "../../schemas/contact-us";

/**
 * Controller for retrieving paginated and filterable list of contact entries
 * Supports filtering by category, service, date range with pagination and sorting
 */
export const getAllContacts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Use validated query data if available, otherwise fall back to raw query
    const query =
      (req as any).validatedQuery ||
      (req.query as unknown as GetAllContactUsQueryType);
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      parentCategoryId,
      serviceId,
      search,
      startDate,
      endDate,
      status,
    } = query;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (parentCategoryId) {
      where.parentCategoryId = parentCategoryId;
    }

    if (serviceId) {
      where.serviceId = serviceId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          fullName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          phoneNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          message: {
            contains: search,
            mode: "centric",
          },
        },
      ];
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

    // Get counts and data with relations
    const [totalCount, contacts] = await Promise.all([
      db.contactUs.count({ where }),
      db.contactUs.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: (page - 1) * limit,
        take: limit,
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
      }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Contact entries retrieved successfully",
      data: contacts,
      pagination: {
        page,
        limit,
        total_items: totalCount,
        total_pages: totalPages,
      },
    });
  }
);

export default getAllContacts;
