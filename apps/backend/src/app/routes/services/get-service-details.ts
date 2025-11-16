import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";

/**
 * Controller for fetching service details with addons and category info
 * Returns 404 if service not found
 */
export const getServiceDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const service = await db.service.findUnique({
      where: { id },
      include: {
        parentCategory: {
          select: {
            id: true,
            name: true,
            tagline: true,
            description: true,
            cardImage: true,
            detailsImage: true,
            isPremium: true,
            isRepairingService: true,
            isActive: true,
            isShowHome: true,
            sortOrder: true,
          },
        },
        image: true,
        serviceAddons: {
          select: {
            id: true,
            addonText: true,
            sortOrder: true,
            isActive: true,
          },
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!service) {
      return sendApiResponse(res, {
        status: httpStatus.NOT_FOUND,
        success: false,
        message: "Service not found",
        data: null,
      });
    }

    // Add counts for better response
    const result = {
      ...service,
      _count: {
        serviceAddons: service.serviceAddons.length,
      },
    };

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Service details retrieved successfully",
      data: result,
    });
  },
);

export default getServiceDetails;
