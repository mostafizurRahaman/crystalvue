// controllers/categories/get-all-categories.controller.ts
import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import { type GetAllCategoriesQueryType } from "../../schemas/categories";

export const getAllCategoriesRoute = express.Router();

getAllCategoriesRoute.get(
  "/",
  catchAsync(async (req, res) => {
    // Use validated query data if available, otherwise fall back to raw query
    const query =
      (req as any).validatedQuery ||
      (req.query as unknown as GetAllCategoriesQueryType);
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      isActive,
      isPremium,
      isRepairingService,
      isShowHome,
      search,
      userId,
      from_date,
      to_date,
    } = query;

    console.log({ query });

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

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

    if (userId) {
      where.userId = userId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { tagline: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Date filtering
    if (from_date || to_date) {
      const createdAtFilter: any = {};
      if (from_date) {
        createdAtFilter.gte = new Date(from_date);
      }
      if (to_date) {
        createdAtFilter.lte = new Date(to_date);
      }
      where.createdAt = createdAtFilter;
    }

    const totalCount = await db.category.count({ where });

    const categories = await db.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
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
        _count: {
          select: {
            services: true,
            categoryAddons: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
      pagination: {
        page,
        limit,
        total_items: totalCount,
        total_pages: totalPages,
      },
    });
  })
);
