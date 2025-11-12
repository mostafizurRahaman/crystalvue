// src/app/routes/categories/delete-categories.ts
import express from "express";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares";
import {
  deleteCategoryParamsSchema,
  type DeleteCategoryParamsType,
} from "../../schemas/categories";
import { deleteFromCloudinaryByPublicId } from "../../utils/delete-image-by-public-id";

export const deleteCategoryRoute = express.Router();

deleteCategoryRoute.delete(
  "/:id",
  auth(["admin", "superadmin"]),
  validateZodSchema({
    params: deleteCategoryParamsSchema,
  }),
  catchAsync(async (req, res, next) => {
    const { id } = req.params as DeleteCategoryParamsType;

    const result = await db.$transaction(
      async (tx) => {
        // Step 1: Get category with all related data including images
        const existingCategory = await tx.category.findUnique({
          where: { id },
          include: {
            services: true,
            categoryAddons: true,
            cardImage: true,
            detailsImage: true,
          },
        });

        if (!existingCategory) {
          throw new AppError(httpStatus.NOT_FOUND, "Category not found");
        }

        // Check if category has associated services
        if (existingCategory.services.length > 0) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Cannot delete category with ${existingCategory.services.length} associated service(s). Please remove all services first.`,
          );
        }

        // Step 2: Delete from Cloudinary atomic operation
        const cloudinaryDeletions = [];

        if (existingCategory.cardImage) {
          try {
            const cardImageResult = await deleteFromCloudinaryByPublicId(
              existingCategory.cardImage.publicId,
              "image",
            );
            cloudinaryDeletions.push({
              type: "cardImage",
              result: cardImageResult,
            });
            console.log(
              `Successfully deleted category card image: ${existingCategory.cardImage.publicId}`,
            );
          } catch (cloudinaryError) {
            throw new AppError(
              httpStatus.INTERNAL_SERVER_ERROR,
              `Failed to delete card image from Cloudinary: ${cloudinaryError instanceof Error ? cloudinaryError.message : "Unknown error"}`,
            );
          }
        }

        if (existingCategory.detailsImage) {
          try {
            const detailsImageResult = await deleteFromCloudinaryByPublicId(
              existingCategory.detailsImage.publicId,
              "image",
            );
            cloudinaryDeletions.push({
              type: "detailsImage",
              result: detailsImageResult,
            });
            console.log(
              `Successfully deleted category details image: ${existingCategory.detailsImage.publicId}`,
            );
          } catch (cloudinaryError) {
            throw new AppError(
              httpStatus.INTERNAL_SERVER_ERROR,
              `Failed to delete details image from Cloudinary: ${cloudinaryError instanceof Error ? cloudinaryError.message : "Unknown error"}`,
            );
          }
        }

        const deletedOrder = existingCategory.sortOrder;

        // Step 3: Delete the category (this will cascade delete categoryAddons and Image relations)
        await tx.category.delete({
          where: { id },
        });

        // Step 4: Normalize sort orders - shift remaining categories up
        await tx.category.updateMany({
          where: {
            sortOrder: { gt: deletedOrder },
          },
          data: {
            sortOrder: { decrement: 1 },
          },
        });

        return {
          id,
          name: existingCategory.name,
          deletedAddonsCount: existingCategory.categoryAddons.length,
          deletedImagesCount:
            (existingCategory.cardImage ? 1 : 0) +
            (existingCategory.detailsImage ? 1 : 0),
          cloudinaryDeletions,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    );

    if (!result || typeof result !== "object") return;

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message:
        "Category deleted atomically with Cloudinary cleanup and order normalization",
      data: result,
    });
  }),
);
