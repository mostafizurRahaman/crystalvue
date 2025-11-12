import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import type { GetContactByStatusQueryType } from "../../schemas/contact-us";

/**
 * Controller for getting contacts by status
 * Supports pagination and sorting for status-specific views
 */
export const getContactsByStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as unknown as GetContactByStatusQueryType;
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const where = {
      status: status,
    };

    const offset = (page - 1) * limit;

    const [totalCount, contacts] = await Promise.all([
      db.contactUs.count({ where }),
      db.contactUs.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: offset,
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

    const totalPages = Math.ceil(totalCount / limit);

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: `Retrieved ${contacts.length} ${status} contacts`,
      data: contacts,
      pagination: {
        page,
        limit,
        total_items: totalCount,
        total_pages: totalPages,
      },
      summary: {
        status,
        count: contacts.length,
        available_statuses: ["READY", "PENDING", "APPROVED", "REJECTED"],
      },
    });
  },
);

export default getContactsByStatus;
