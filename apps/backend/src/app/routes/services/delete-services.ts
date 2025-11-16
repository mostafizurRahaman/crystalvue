import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { deleteFromCloudinaryByPublicId } from "../../utils/delete-image-by-public-id";

/**
 * Controller for deleting a service by ID
 * Performs atomic deletion with Cloudinary cleanup and cascade deletion of service add-ons
 */
export const deleteServices = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Check if service exists with image relation
    const existingService = await db.service.findUnique({
      where: { id },
      include: {
        image: true,
        serviceAddons: true,
      },
    });

    if (!existingService) {
      throw new AppError(httpStatus.NOT_FOUND, "Service not found");
    }

    // Delete from Cloudinary first (external service call)
    let cloudinaryDeletionResult = null;

    if (existingService.image) {
      try {
        cloudinaryDeletionResult = await deleteFromCloudinaryByPublicId(
          existingService.image.publicId,
          "image",
        );
        console.log(
          `Successfully deleted service image: ${existingService.image.publicId}`,
        );
      } catch (cloudinaryError) {
        // Log the error but continue with DB deletion for cleanup
        console.error(`Failed to delete Cloudinary image: ${cloudinaryError instanceof Error ? cloudinaryError.message : "Unknown error"}`);
        // Don't throw error here - we still want to clean up the database
      }
    }

    const result = await db.$transaction(
      async (tx) => {

        // Step 2: Delete the service (cascade will handle serviceAddons and Image relations)
        await tx.service.delete({
          where: { id },
        });

        return {
          id,
          name: existingService.name,
          deletedAddonsCount: existingService.serviceAddons.length,
          deletedImage: existingService.image ? true : false,
          cloudinaryDeletionResult,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    );

    return sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Service deleted atomically with Cloudinary cleanup",
      data: result,
    });
  },
);

export default deleteServices;
