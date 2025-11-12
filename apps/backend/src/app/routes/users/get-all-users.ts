import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import { validateZodSchema } from "../../middlewares";
import {
  getAllUsersQuerySchema,
  type GetAllUsersQueryType,
} from "../../schemas/users";

/**
 * GET /users - Get all users with filtering and pagination (Super Admin only)
 */
export const getAllUsersRoute = express.Router();

getAllUsersRoute.get(
  "/",
  auth(["superadmin"]), // Only superadmin can view all users
  validateZodSchema({ query: getAllUsersQuerySchema }),
  catchAsync(async (req, res) => {
    // Use validated query data if available, otherwise fall back to raw query
    const queryData =
      (req as any).validatedQuery ||
      (req.query as unknown as GetAllUsersQueryType);

    // Build where conditions for filtering
    const whereConditions: any = {};

    if (queryData.search) {
      whereConditions.OR = [
        { name: { contains: queryData.search, mode: "insensitive" } },
        { email: { contains: queryData.search, mode: "insensitive" } },
      ];
    }

    if (queryData.role) {
      whereConditions.role = queryData.role;
    }

    if (queryData.userStatus) {
      whereConditions.userStatus = queryData.userStatus;
    }

    // Get total count for pagination
    const totalUsers = await db.user.count({
      where: whereConditions,
    });

    // Calculate pagination
    const skip = (queryData.page - 1) * queryData.limit;

    // Get users with pagination and sorting
    const users = await db.user.findMany({
      where: whereConditions,
      skip,
      take: queryData.limit,
      orderBy: {
        [queryData.sortBy]: queryData.sortOrder,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        userStatus: true,
        profileUrl: true,
        createdAt: true,
        updatedAt: true,
        // Excluding password field for security
      },
    });

    // Return paginated response
    const totalPages = Math.ceil(totalUsers / queryData.limit);

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Users retrieved successfully",
      data: {
        users,
        pagination: {
          currentPage: queryData.page,
          totalPages,
          totalUsers,
          limit: queryData.limit,
          hasNext: queryData.page < totalPages,
          hasPrev: queryData.page > 1,
        },
      },
    });
  })
);
