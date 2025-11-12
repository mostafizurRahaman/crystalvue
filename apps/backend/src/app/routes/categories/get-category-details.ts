// controllers/categories/get-single-category.controller.ts
import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import { validateZodSchema } from "../../middlewares";
import {
  getCategoryDetailsParamsSchema,
  getCategoryDetailsQuerySchema,
  type GetCategoryDetailsParamsType,
  type GetCategoryDetailsQueryType,
} from "../../schemas/categories";

export const getSingleCategoryRoute = express.Router();

getSingleCategoryRoute.get(
  "/:id",
  auth(["admin", "superadmin"]),
  validateZodSchema({
    params: getCategoryDetailsParamsSchema,
    query: getCategoryDetailsQuerySchema,
  }),
  catchAsync(async (req, res, next) => {
    const { id } = req.params as GetCategoryDetailsParamsType;
    const { includeInactive = false } =
      req.query as GetCategoryDetailsQueryType;
    const includeInactiveItems = includeInactive;

    const category = await db.category.findFirst({
      where: { id },
      include: {
        categoryAddons: {
          where: includeInactiveItems ? {} : { isActive: true },
          orderBy: { createdAt: "asc" },
        },
        services: {
          where: includeInactiveItems ? {} : { isActive: true },
          orderBy: { createdAt: "asc" },
          include: {
            serviceAddons: {
              where: includeInactiveItems ? {} : { isActive: true },
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
            role: true,
          },
        },
        _count: {
          select: {
            services: includeInactiveItems
              ? true
              : { where: { isActive: true } },
            categoryAddons: includeInactiveItems
              ? true
              : { where: { isActive: true } },
          },
        },
      },
    });

    if (!category) {
      return sendApiResponse(res, {
        status: httpStatus.NOT_FOUND,
        success: false,
        message: "Category not found",
        data: null,
      });
    }

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  }),
);
