// src/app/routes/categories/create-category.ts
import express from "express";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares";
import {
  createCategorySchema,
  type CreateCategoryType,
} from "../../schemas/categories";
import { handleImageSave } from "../../utils/image-helpers";

export const createCategoryRoute = express.Router();

createCategoryRoute.post(
  "/",
  catchAsync(async (req, res, next) => {
    const data = req.body as CreateCategoryType;

    // Use transaction for atomic operation
    const category = await db.$transaction(
      async (tx) => {
        // Check for duplicate (case-insensitive)
        const existingCategory = await tx.category.findFirst({
          where: {
            name: {
              equals: data.name,
              mode: "insensitive",
            },
          },
        });

        if (existingCategory) {
          throw new AppError(
            httpStatus.CONFLICT,
            "Category with this name already exists",
          );
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

        // Calculate sort order if not provided
        let sortOrder = data.sortOrder;
        if (sortOrder === undefined) {
          const maxSort = await tx.category.aggregate({
            _max: { sortOrder: true },
          });
          sortOrder = (maxSort._max.sortOrder ?? -1) + 1;
        } else {
          // Shift existing categories if needed
          await tx.category.updateMany({
            where: {
              sortOrder: {
                gte: sortOrder,
              },
            },
            data: {
              sortOrder: {
                increment: 1,
              },
            },
          });
        }

        // Handle image creation
        const cardImageId = await handleImageSave(null, data.cardImage, tx);
        const detailsImageId = await handleImageSave(null, data.detailsImage, tx);

        // Create category with deduplicated add-ons
        const uniqueAddons = [...new Set(data.addons || [])];

        return await tx.category.create({
          data: {
            name: data.name,
            tagline: data.tagline,
            description: data.description,
            cardImageId,
            detailsImageId,
            isPremium: data.isPremium,
            isRepairingService: data.isRepairingService,
            isShowHome: data.isShowHome,
            isActive: data.isActive,
            sortOrder,
            userId: data.userId,
            categoryAddons: uniqueAddons.length
              ? {
                  create: uniqueAddons.map((addonText, index) => ({
                    addonText,
                    sortOrder: index + 1,
                  })),
                }
              : undefined,
          },
          include: {
            categoryAddons: {
              where: { isActive: true },
              orderBy: { sortOrder: "asc" },
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

    if (category && typeof category !== "object") return;

    sendApiResponse(res, {
      status: httpStatus.CREATED,
      success: true,
      message: "Category created successfully",
      data: category,
    });
  }),
);
