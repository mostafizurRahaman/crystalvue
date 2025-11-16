import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse, hashPassword } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares";
import {
  updateUserParamsSchema,
  updateUserSchema,
  type UpdateUserType,
  type UpdateUserParamsType,
} from "../../schemas/users";

export const updateUserRoute = express.Router();

/**
 * PUT /users/:id - Update a user (Super Admin only)
 * Super Admin can update any user including their role and status
 */
updateUserRoute.put(
  "/:id",
  auth(["superadmin"]), // Only superadmin can update users
  validateZodSchema({
    params: updateUserParamsSchema,
    body: updateUserSchema,
  }),
  catchAsync(async (req, res, next) => {
    const { id } = req.params as UpdateUserParamsType;
    const updateData = req.body as UpdateUserType;
    const currentUserId = req.user?.id;

    // Check if user to update exists
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Prevent superadmin from modifying themselves through this endpoint
    if (id === currentUserId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Cannot update your own account through this endpoint"
      );
    }

    // Hash password if provided
    const processedData: any = { ...updateData };
    if (updateData.password) {
      processedData.password = await hashPassword(updateData.password);
    }

    // Update the user
    const updatedUser = await db.user.update({
      where: { id },
      data: processedData,
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

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  })
);

export default updateUserRoute;
