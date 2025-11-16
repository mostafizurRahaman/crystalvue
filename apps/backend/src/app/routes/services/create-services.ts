import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { handleImageSave } from "../../utils/image-helpers";

/**
 * Controller for creating a new service
 * Validates parent category exists and is active, returns 201 on success
 */
export const createServices = catchAsync(async (req: Request, res: Response) => {
    const {
      parentCategoryId,
      name,
      tagline,
      description,
      image,
      price,
      isPremium,
      isActive,
    } = req.body;

    const result = await db.$transaction(
      async (tx) => {
        // Validate parent category exists and is active
        const parentCategory = await tx.category.findUnique({
          where: { id: parentCategoryId },
          select: { id: true, isActive: true },
        });

        if (!parentCategory) {
          throw new AppError(httpStatus.NOT_FOUND, "Parent category not found");
        }

        if (!parentCategory.isActive) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "Parent category is not active",
          );
        }

        // Check for duplicate service name within the same category (case-insensitive)
        const existingService = await tx.service.findFirst({
          where: {
            parentCategoryId,
            name: {
              equals: name,
              mode: "insensitive",
            },
          },
        });

        if (existingService) {
          throw new AppError(
            httpStatus.CONFLICT,
            "Service with this name already exists in the category",
          );
        }

        // Handle image creation
        const imageId = await handleImageSave(null, image, tx);

        // Create the service
        const newService = await tx.service.create({
          data: {
            parentCategoryId,
            name,
            tagline,
            description,
            imageId,
            price: price ? new Prisma.Decimal(price.toString()) : null,
            isPremium: isPremium ?? false,
            isActive: isActive ?? true,
          },
          include: {
            parentCategory: {
              select: {
                id: true,
                name: true,
                isActive: true,
              },
            },
            image: {
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
            serviceAddons: {
              where: { isActive: true },
              orderBy: { sortOrder: "asc" },
            },
          },
        });

        return newService;
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
      message: "Service created successfully",
      data: result,
    });
  },
);

export default createServices;
