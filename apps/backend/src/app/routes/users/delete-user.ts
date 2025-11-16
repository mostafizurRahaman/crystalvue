import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares";
import {
  deleteUserParamsSchema,
  type DeleteUserParamsType,
} from "../../schemas/users";

export const deleteUserRoute = express.Router();

/**
 * DELETE /users/:id - Delete a user (Super Admin only)
 * Super Admin can delete any user except themselves
 */
deleteUserRoute.delete(
  "/:id",
  auth(["superadmin"]), // Only superadmin can delete users
  validateZodSchema({ params: deleteUserParamsSchema }),
  catchAsync(async (req, res, next) => {
    const { id } = req.params as DeleteUserParamsType;
    const currentUserId = req.user?.id;

    // Check if user to delete exists
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Prevent superadmin from deleting themselves
    if (id === currentUserId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Cannot delete your own account",
      );
    }

    // Check if user has created any content that would be affected
    const sliderCount = await db.heroSlider.count({
      where: { userId: id },
    });

    const categoryCount = await db.category.count({
      where: { userId: id },
    });

    if (sliderCount > 0 || categoryCount > 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Cannot delete user. User has created content (${sliderCount} sliders, ${categoryCount} categories). Please reassign or delete content first.`,
      );
    }

    // Perform atomic deletion
    await db.$transaction(async (tx) => {
      // Delete the user (Prisma will handle relations properly due to SetNull onDelete)
      await tx.user.delete({
        where: { id },
      });
    });

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "User deleted successfully",
      data: {
        id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  }),
);

export default deleteUserRoute;
