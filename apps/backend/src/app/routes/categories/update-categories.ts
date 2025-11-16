// src/app/routes/categories/update-categories.ts
import express from "express";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares";
import {
  updateCategoryParamsSchema,
  updateCategorySchema,
  type UpdateCategoryParamsType,
  type UpdateCategoryType,
} from "../../schemas/categories";
import { handleImageSave } from "../../utils/image-helpers";

export const updateCategoryRoute = express.Router();

updateCategoryRoute.put(
  "/:id",
  auth(["admin", "superadmin"]),
  validateZodSchema({
    params: updateCategoryParamsSchema,
    body: updateCategorySchema,
  }),
  catchAsync(async (req, res, next) => {
    const { id } = req.params as UpdateCategoryParamsType;
    const data = req.body as UpdateCategoryType;

    const updatedCategory = await db.$transaction(
      async (tx) => {
        const existingCategory = await tx.category.findUnique({
          where: { id },
        });

        if (!existingCategory) {
          throw new AppError(httpStatus.NOT_FOUND, "Category not found");
        }

        // Check for name conflict (case-insensitive)
        if (data.name && data.name !== existingCategory.name) {
          const nameConflict = await tx.category.findFirst({
            where: {
              name: {
                equals: data.name,
                mode: "insensitive",
              },
              id: { not: id },
            },
          });

          if (nameConflict) {
            throw new AppError(
              httpStatus.CONFLICT,
              "Category with this name already exists",
            );
          }
        }

        // Validate userId if provided
        if (data.userId) {
          const userExists = await tx.user.findUnique({
            where: { id: data.userId },
          });

          if (!userExists) {
            throw new AppError(httpStatus.NOT_FOUND, "User not found");
          }
        }

        // Handle sort order change
        if (
          data.sortOrder !== undefined &&
          data.sortOrder !== existingCategory.sortOrder
        ) {
          const oldOrder = existingCategory.sortOrder;
          const newOrder = data.sortOrder;

          if (newOrder > oldOrder) {
            // Moving down: shift items up
            await tx.category.updateMany({
              where: {
                id: { not: id },
                sortOrder: {
                  gt: oldOrder,
                  lte: newOrder,
                },
              },
              data: {
                sortOrder: { decrement: 1 },
              },
            });
          } else {
            // Moving up: shift items down
            await tx.category.updateMany({
              where: {
                id: { not: id },
                sortOrder: {
                  gte: newOrder,
                  lt: oldOrder,
                },
              },
              data: {
                sortOrder: { increment: 1 },
              },
            });
          }
        }

        // Handle image updates
        const cardImageId = await handleImageSave(existingCategory.cardImageId, data.cardImage, tx);
        const detailsImageId = await handleImageSave(existingCategory.detailsImageId, data.detailsImage, tx);

        // Handle add-ons update
        if (Array.isArray(data.addons)) {
          // Remove existing add-ons
          await tx.categoryAddon.deleteMany({
            where: { parentCategoryId: id },
          });

          // Add new unique add-ons
          const uniqueAddons = [...new Set(data.addons)];
          if (uniqueAddons.length > 0) {
            await tx.categoryAddon.createMany({
              data: uniqueAddons.map((addonText, index) => ({
                parentCategoryId: id,
                addonText,
                sortOrder: index + 1,
              })),
            });
          }
        }

        // Update category
        return await tx.category.update({
          where: { id },
          data: {
            ...(data.name && { name: data.name }),
            ...(data.tagline !== undefined && { tagline: data.tagline }),
            ...(data.description !== undefined && {
              description: data.description,
            }),
            ...(cardImageId !== existingCategory.cardImageId && { cardImageId }),
            ...(detailsImageId !== existingCategory.detailsImageId && { detailsImageId }),
            ...(data.isPremium !== undefined && {
              isPremium: data.isPremium,
            }),
            ...(data.isRepairingService !== undefined && {
              isRepairingService: data.isRepairingService,
            }),
            ...(data.isShowHome !== undefined && {
              isShowHome: data.isShowHome,
            }),
            ...(data.isActive !== undefined && { isActive: data.isActive }),
            ...(data.sortOrder !== undefined && {
              sortOrder: data.sortOrder,
            }),
            ...(data.userId !== undefined && { userId: data.userId }),
          },
          include: {
            categoryAddons: {
              where: { isActive: true },
              orderBy: { createdAt: "asc" },
            },
            services: {
              where: { isActive: true },
              orderBy: { createdAt: "asc" },
            },
            cardImage: {
              select: {
                id: true,
                url: true,
                publicId: true,
                folder: true,
                altText: true,
                width: true,
                height: true,
                format: true,
                size: true,
              },
            },
            detailsImage: {
              select: {
                id: true,
                url: true,
                publicId: true,
                folder: true,
                altText: true,
                width: true,
                height: true,
                format: true,
                size: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                profileUrl: true,
              },
            },
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    );

    if (updatedCategory && typeof updatedCategory !== "object") return;

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  }),
);
