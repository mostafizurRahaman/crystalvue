import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import { validateZodSchema } from "../../middlewares/validate-schema";
import AppError from "../../classes/AppError";
import {
  getUserDetailsParamsSchema,
  type GetUserDetailsParamsType,
} from "../../schemas/users";

/**
 * GET /users/:id - Get user details by ID (Super Admin only)
 */
export const getUserDetailsRoute = express.Router();

getUserDetailsRoute.get(
  "/:id",
  auth(["superadmin"]), // Only superadmin can view user details
  validateZodSchema({ params: getUserDetailsParamsSchema }),
  catchAsync(async (req, res, next) => {
    const { id } = req.params as GetUserDetailsParamsType;

    // Find user with their created content counts
    const user = await db.user.findUnique({
      where: { id },
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
        _count: {
          select: {
            createdSliders: true,
            Category: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "User details retrieved successfully",
      data: {
        ...user,
        sliderCount: user._count.createdSliders,
        categoryCount: user._count.Category,
        // Remove _count from final response for cleaner output
        _count: undefined,
      },
    });
  }),
);
