import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import type { GetContactDetailsParamsType } from "../../schemas/contact-us";

/**
 * Controller for fetching contact details by ID with relations
 * Returns 404 if contact not found
 */
export const getContactDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as GetContactDetailsParamsType;

    const contact = await db.contactUs.findUnique({
      where: { id },
      include: {
        parentCategory: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
      },
    });

    if (!contact) {
      throw new AppError(httpStatus.NOT_FOUND, "Contact entry not found");
    }

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Contact details retrieved successfully",
      data: contact,
    });
  },
);

export default getContactDetails;
