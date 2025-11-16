// controllers/categories/get-bulk-categories.controller.ts
import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import { validateZodSchema } from "../../middlewares";
import {
  getBulkCategoriesQuerySchema,
  type GetBulkCategoriesQueryType,
} from "../../schemas/categories";

export const getBulkCategoriesRoute = catchAsync(async (req, res, next) => {
  const where: Record<string, unknown> = {};

  // Use validated query data if available, otherwise fall back to raw query
  const query =
    (req as any).validatedQuery || (req.query as GetBulkCategoriesQueryType);
  const { ids, isActive, isPremium, isRepairingService, isShowHome } = query;

  if (ids && ids.length > 0) {
    where.id = { in: ids };
  }

  if (typeof isActive === "boolean") {
    where.isActive = isActive;
  }

  if (typeof isPremium === "boolean") {
    where.isPremium = isPremium;
  }

  if (typeof isRepairingService === "boolean") {
    where.isRepairingService = isRepairingService;
  }

  if (typeof isShowHome === "boolean") {
    where.isShowHome = isShowHome;
  }

  const categories = await db.category.findMany({
    where,
    orderBy: { createdAt: "asc" },
    include: {
      categoryAddons: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      },
      services: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
        include: {
          serviceAddons: {
            where: { isActive: true },
            orderBy: { createdAt: "asc" },
          },
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
      _count: {
        select: {
          services: true,
          categoryAddons: true,
        },
      },
    },
  });

  sendApiResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Categories retrieved for export",
    data: categories,
    summary: {
      total: categories.length,
      exportedAt: new Date().toISOString(),
    },
  });
});
