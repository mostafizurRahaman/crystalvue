import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";

/**
 * Controller for removing a service add-on atomically
 * Supports deletion by ID or by (serviceId + addonText) combination, returns 204 on success
 */
export const removeServiceAddon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { serviceId, addonText } = req.query as Record<string, string>;

    await db.$transaction(
      async (tx) => {
        let deletedAddon;

        // Delete by ID if provided in params
        if (id) {
          // Check if add-on exists by ID
          const existingAddon = await tx.serviceAddon.findUnique({
            where: { id },
            select: { id: true },
          });

          if (!existingAddon) {
            throw new AppError(
              httpStatus.NOT_FOUND,
              "Service add-on not found",
            );
          }

          deletedAddon = await tx.serviceAddon.delete({
            where: { id },
          });
        }
        // Delete by serviceId + addonText combination if provided as query params
        else if (serviceId && addonText) {
          // Check if add-on exists by composite key
          const existingAddon = await tx.serviceAddon.findFirst({
            where: {
              serviceId,
              addonText,
            },
            select: { id: true },
          });

          if (!existingAddon) {
            throw new AppError(
              httpStatus.NOT_FOUND,
              "Service add-on not found",
            );
          }

          deletedAddon = await tx.serviceAddon.deleteMany({
            where: {
              serviceId,
              addonText,
            },
          });

          if (deletedAddon.count === 0) {
            throw new AppError(
              httpStatus.NOT_FOUND,
              "Service add-on not found",
            );
          }
        } else {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "Either provide ID in params or serviceId + addonText as query parameters",
          );
        }

        return deletedAddon;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    );

    return res.status(httpStatus.NO_CONTENT).send();
  },
);

export default removeServiceAddon;
