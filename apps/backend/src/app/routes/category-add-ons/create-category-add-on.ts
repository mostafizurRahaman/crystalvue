// src/app/routes/category-add-ons/create-category-add-on.ts
import express from "express";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares";
import {
  createCategoryAddOnBodySchema,
  createCategoryAddOnParamsSchema,
  type CreateCategoryAddOnBodyType,
  type CreateCategoryAddOnParamsType,
} from "../../schemas/category-add-ons";

export const addCategoryAddonsRoute = express.Router();

addCategoryAddonsRoute.post(
  "/:id/addons",
  auth(["admin", "superadmin"]),
  validateZodSchema({
    params: createCategoryAddOnParamsSchema,
    body: createCategoryAddOnBodySchema,
  }),
  catchAsync(async (req, res, next) => {
    const { id } = req.params as CreateCategoryAddOnParamsType;
    const { addons } = req.body as CreateCategoryAddOnBodyType;

    const result = await db.$transaction(
      async (tx) => {
        const category = await tx.category.findUnique({
          where: { id },
          include: {
            categoryAddons: true,
          },
        });

        if (!category) {
          throw new AppError(httpStatus.NOT_FOUND, "Category not found");
        }

        // Check for duplicates (case-insensitive)
        const existingAddonTexts = category.categoryAddons.map((a) =>
          a.addonText.toLowerCase(),
        );
        const uniqueNewAddons = [...new Set(addons)];
        const duplicates = uniqueNewAddons.filter((addon) =>
          existingAddonTexts.includes(addon.toLowerCase()),
        );

        if (duplicates.length > 0) {
          throw new AppError(
            httpStatus.CONFLICT,
            `Some add-ons already exist: ${duplicates.join(", ")}`,
          );
        }

        // Get max sort order
        const maxSortOrder =
          category.categoryAddons.length > 0
            ? Math.max(...category.categoryAddons.map((a) => a.sortOrder))
            : 0;

        // Create new add-ons
        await tx.categoryAddon.createMany({
          data: uniqueNewAddons.map((addonText, index) => ({
            parentCategoryId: id,
            addonText,
            sortOrder: maxSortOrder + index + 1,
          })),
        });

        // Return updated category
        return await tx.category.findUnique({
          where: { id },
          include: {
            categoryAddons: {
              where: { isActive: true },
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
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    );

    if (!result || typeof result !== "object") return;

    sendApiResponse(res, {
      status: httpStatus.CREATED,
      success: true,
      message: `Add-on(s) added successfully`,
      data: result,
    });
  }),
);
