import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";

/**
 * Controller for creating a service add-on atomically
 * Uses transaction to ensure uniqueness (serviceId, addonText), returns 201 on success
 */
export const addServiceAddon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { serviceId, addonText, sortOrder, isActive = true } = req.body;

    const result = await db.$transaction(
      async (tx) => {
        // Validate service exists and is active
        const service = await tx.service.findUnique({
          where: { id: serviceId },
          select: { id: true, isActive: true },
        });

        if (!service) {
          throw new AppError(httpStatus.NOT_FOUND, "Service not found");
        }

        if (!service.isActive) {
          throw new AppError(httpStatus.BAD_REQUEST, "Service is not active");
        }

        // Check for duplicate addon text for this service
        const existingAddon = await tx.serviceAddon.findFirst({
          where: {
            serviceId,
            addonText,
          },
        });

        if (existingAddon) {
          throw new AppError(
            httpStatus.CONFLICT,
            "Service add-on with this text already exists",
          );
        }

        // Calculate sort order if not provided
        let finalSortOrder = sortOrder;
        if (sortOrder === undefined) {
          const maxSort = await tx.serviceAddon.aggregate({
            _max: { sortOrder: true },
            where: { serviceId },
          });
          finalSortOrder = (maxSort._max.sortOrder ?? 0) + 1;
        } else {
          // Check for duplicate sort order within the same service
          const existingSort = await tx.serviceAddon.findFirst({
            where: {
              serviceId,
              sortOrder: finalSortOrder,
            },
          });

          if (existingSort) {
            // Shift existing addons with same or higher sort order
            await tx.serviceAddon.updateMany({
              where: {
                serviceId,
                sortOrder: {
                  gte: finalSortOrder,
                },
              },
              data: {
                sortOrder: {
                  increment: 1,
                },
              },
            });
          }
        }

        // Create the service add-on
        const newAddon = await tx.serviceAddon.create({
          data: {
            serviceId,
            addonText,
            sortOrder: finalSortOrder,
            isActive,
          },
          include: {
            service: {
              select: {
                id: true,
                name: true,
                isActive: true,
              },
            },
          },
        });

        return newAddon;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    );

    sendApiResponse(res, {
      status: httpStatus.CREATED,
      success: true,
      message: "Service add-on created successfully",
      data: result,
    });
  },
);

export default addServiceAddon;
