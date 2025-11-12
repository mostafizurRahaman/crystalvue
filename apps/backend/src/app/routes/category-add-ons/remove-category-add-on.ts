// src/app/routes/category-add-ons/remove-category-add-on.ts
import express from "express";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares";
import {
  removeCategoryAddOnBodySchema,
  removeCategoryAddOnParamsSchema,
  type RemoveCategoryAddOnBodyType,
  type RemoveCategoryAddOnParamsType,
} from "../../schemas/category-add-ons";

export const removeCategoryAddonsRoute = express.Router();

removeCategoryAddonsRoute.delete(
  "/:id/addons",
  auth(["admin", "superadmin"]),
  validateZodSchema({
    params: removeCategoryAddOnParamsSchema,
    body: removeCategoryAddOnBodySchema,
  }),
  catchAsync(async (req, res, next) => {
    const { id } = req.params as RemoveCategoryAddOnParamsType;
    const { addonIds, addonTexts } = req.body as RemoveCategoryAddOnBodyType;

    const result = await db.$transaction(
      async (tx) => {
        // Verify category exists
        const category = await tx.category.findUnique({
          where: { id },
          include: {
            categoryAddons: {
              orderBy: { createdAt: "asc" },
            },
          },
        });

        if (!category) {
          throw new AppError(httpStatus.NOT_FOUND, "Category not found");
        }

        // Build where clause for finding add-ons to delete
        const whereClause: Record<string, unknown> = {
          parentCategoryId: id,
        };

        if (addonIds && addonIds.length > 0) {
          whereClause.id = { in: addonIds };
        } else if (addonTexts && addonTexts.length > 0) {
          // Case-insensitive text matching
          whereClause.addonText = {
            in: addonTexts,
            mode: "insensitive",
          };
        }

        // Find add-ons to remove
        const addonsToRemove = await tx.categoryAddon.findMany({
          where: whereClause,
          orderBy: { createdAt: "asc" },
        });

        if (addonsToRemove.length === 0) {
          throw new AppError(
            httpStatus.NOT_FOUND,
            "No matching add-ons found to remove",
          );
        }

        // Get the sort orders of items to be deleted
        const deletedSortOrders = addonsToRemove.map((a) => a.sortOrder);
        const minDeletedOrder = Math.min(...deletedSortOrders);

        // Delete the add-ons
        const deleteResult = await tx.categoryAddon.deleteMany({
          where: whereClause,
        });

        // Normalize sort orders for remaining add-ons
        // Get all remaining add-ons for this category
        const remainingAddons = await tx.categoryAddon.findMany({
          where: {
            parentCategoryId: id,
            sortOrder: { gt: minDeletedOrder },
          },
          orderBy: { createdAt: "asc" },
        });

        // Update sort orders to maintain continuity
        if (remainingAddons.length > 0) {
          // Calculate how many positions to shift up
          const lastRemainingAddon =
            remainingAddons[remainingAddons.length - 1];
          const shiftAmount = deletedSortOrders.filter(
            (order) =>
              lastRemainingAddon && order < lastRemainingAddon.sortOrder,
          ).length;

          await tx.categoryAddon.updateMany({
            where: {
              parentCategoryId: id,
              sortOrder: { gt: minDeletedOrder },
            },
            data: {
              sortOrder: { decrement: shiftAmount },
            },
          });
        }

        // Alternatively, renumber all remaining add-ons from 1
        // This ensures perfect sequential ordering
        const allRemainingAddons = await tx.categoryAddon.findMany({
          where: { parentCategoryId: id },
          orderBy: { createdAt: "asc" },
        });

        // Batch update with new sequential sort orders
        await Promise.all(
          allRemainingAddons.map((addon, index) =>
            tx.categoryAddon.update({
              where: { id: addon.id },
              data: { sortOrder: index + 1 },
            }),
          ),
        );

        // Return updated category with remaining add-ons
        const updatedCategory = await tx.category.findUnique({
          where: { id },
          include: {
            categoryAddons: {
              orderBy: { createdAt: "asc" },
            },
            services: {
              where: { isActive: true },
              orderBy: { createdAt: "asc" },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                profileUrl: true,
              },
            },
            _count: {
              select: {
                categoryAddons: true,
                services: true,
              },
            },
          },
        });

        return {
          category: updatedCategory,
          removedCount: deleteResult.count,
          removedAddons: addonsToRemove.map((a) => ({
            id: a.id,
            text: a.addonText,
          })),
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
      message: `${result.removedCount} add-on(s) removed successfully`,
      data: {
        category: result.category,
        removed: {
          count: result.removedCount,
          addons: result.removedAddons,
        },
      },
    });
  }),
);
