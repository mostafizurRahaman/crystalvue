// src/app/routes/categories/swap-categories.ts
import express from "express";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares";
import {
  swapCategoriesSchema,
  type SwapCategoriesType,
} from "../../schemas/categories";

export const swapCategoriesRoute = express.Router();

swapCategoriesRoute.post(
  "/swap",
  auth(["admin", "superadmin"]),
  validateZodSchema({ body: swapCategoriesSchema }),
  catchAsync(async (req, res, next) => {
    const { categoryId1, categoryId2 } = req.body as SwapCategoriesType;

    if (categoryId1 === categoryId2) {
      return sendApiResponse(res, {
        status: httpStatus.BAD_REQUEST,
        success: false,
        message: "Cannot swap a category with itself",
        data: null,
      });
    }

    const result = await db.$transaction(
      async (tx) => {
        const [category1, category2] = await Promise.all([
          tx.category.findUnique({ where: { id: categoryId1 } }),
          tx.category.findUnique({ where: { id: categoryId2 } }),
        ]);

        if (!category1 || !category2) {
          throw new AppError(
            httpStatus.NOT_FOUND,
            "One or both categories not found",
          );
        }

        // Swap sort orders
        const tempOrder = category1.sortOrder;

        await tx.category.update({
          where: { id: categoryId1 },
          data: { sortOrder: category2.sortOrder },
        });

        await tx.category.update({
          where: { id: categoryId2 },
          data: { sortOrder: tempOrder },
        });

        // Return both updated categories
        return await Promise.all([
          tx.category.findUnique({
            where: { id: categoryId1 },
            include: {
              categoryAddons: {
                where: { isActive: true },
                orderBy: { sortOrder: "asc" },
              },
            },
          }),
          tx.category.findUnique({
            where: { id: categoryId2 },
            include: {
              categoryAddons: {
                where: { isActive: true },
                orderBy: { sortOrder: "asc" },
              },
            },
          }),
        ]);
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    );

    if (result && !Array.isArray(result)) return;

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Categories swapped successfully",
      data: {
        category1: result[0],
        category2: result[1],
      },
    });
  }),
);
