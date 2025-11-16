import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse, hashPassword } from "../../utils";
import AppError from "../../classes/AppError";
import { validateZodSchema } from "../../middlewares";
import { createUserSchema, type CreateUserType } from "../../schemas/users";

export const createUserRoute = express.Router();

/**
 * POST /users - Create a new user (Super Admin only)
 * Super Admin can create admin or superadmin users
 */
createUserRoute.post(
  "/",
  auth(["superadmin"]), // Only superadmin can create users
  validateZodSchema({ body: createUserSchema }),
  catchAsync(async (req, res, next) => {
    const userData = req.body as CreateUserType;

    // Check if user with this email already exists
    const existingUser = await db.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new AppError(
        httpStatus.CONFLICT,
        "User with this email already exists",
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(userData.password);

    // Create the user
    const user = await db.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        password: hashedPassword,
        profileUrl: userData.profileUrl,
        userStatus: userData.userStatus,
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

    // Remove password hash from response (already excluded by select)
    sendApiResponse(res, {
      status: httpStatus.CREATED,
      success: true,
      message: "User created successfully",
      data: user,
    });
  }),
);

export default createUserRoute;
