import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse, hashPassword } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares";
import {
  updateMeSchema,
  type UpdateMeType,
} from "../../schemas/users/update-me";

export const updateMeRoute = express.Router();

/**
 * PUT /users/update-me - Update current user's profile
 * Authenticated users can update their own profile (name, email, password, profileUrl)
 * They cannot update their role or status
 */
updateMeRoute.put(
  "/",
  auth(["admin", "superadmin", "user"]), // All authenticated users can update their own profile
  validateZodSchema({
    body: updateMeSchema,
  }),
  catchAsync(async (req, res, next) => {
    const updateData = req.body as UpdateMeType;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: currentUserId },
    });

    if (!existingUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check if email is being updated and if it's already taken by another user
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await db.user.findFirst({
        where: {
          email: updateData.email,
          id: { not: currentUserId },
        },
      });

      if (emailExists) {
        throw new AppError(
          httpStatus.CONFLICT,
          "Email is already taken by another user"
        );
      }
    }

    // Hash password if provided
    const processedData: any = { ...updateData };
    if (updateData.password) {
      processedData.password = await hashPassword(updateData.password);
    }

    // Update the user
    const updatedUser = await db.user.update({
      where: { id: currentUserId },
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
      message: "Profile updated successfully",
      data: updatedUser,
    });
  })
);

export default updateMeRoute;
