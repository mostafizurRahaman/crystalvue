import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { handleImageSave } from "../../utils/image-helpers";

/**
 * Controller for updating a service by ID
 * Supports partial updates, handles not found (404) scenarios
 */
export const updateServices = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, tagline, description, image, price, isPremium, isActive } =
      req.body;

    const result = await db.$transaction(
      async (tx) => {
        // Check if service exists
        const existingService = await tx.service.findUnique({
          where: { id },
          select: {
            id: true,
            parentCategoryId: true,
            name: true,
            imageId: true,
          },
        });

        if (!existingService) {
          throw new AppError(httpStatus.NOT_FOUND, "Service not found");
        }

        // If updating name, check for duplicates within the same category
        if (name && name !== existingService.name) {
          const duplicateService = await tx.service.findFirst({
            where: {
              parentCategoryId: existingService.parentCategoryId,
              name: {
                equals: name,
                mode: "insensitive",
              },
              id: {
                not: id,
              },
            },
          });

          if (duplicateService) {
            throw new AppError(
              httpStatus.CONFLICT,
              "Service with this name already exists in the category",
            );
          }
        }

        // Handle image updates
        const imageId = await handleImageSave(existingService.imageId, image, tx);

        // Prepare update data (only include provided fields)
        const updateData: Partial<{
          name: string;
          tagline: string;
          description: string | null;
          imageId: string | null;
          price: Prisma.Decimal | null;
          isPremium: boolean;
          isActive: boolean;
        }> = {};

        if (name !== undefined) updateData.name = name;
        if (tagline !== undefined) updateData.tagline = tagline;
        if (description !== undefined) updateData.description = description;
        if (imageId !== existingService.imageId) updateData.imageId = imageId;
        if (price !== undefined)
          updateData.price = price
            ? new Prisma.Decimal(price.toString())
            : null;
        if (isPremium !== undefined) updateData.isPremium = isPremium;
        if (isActive !== undefined) updateData.isActive = isActive;

        // Update the service
        const updatedService = await tx.service.update({
          where: { id },
          data: updateData,
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

        return updatedService;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    );

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Service updated successfully",
      data: result,
    });
  },
);

export default updateServices;
