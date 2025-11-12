import express from "express";
import httpStatus, { status } from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";

// -----------------------------------------------------------------------------
// ROUTER SETUP
// -----------------------------------------------------------------------------
export const getMe = express.Router();

getMe.post(
  "/",
  catchAsync(async (req, res, next) => {
    const user = req.user;

    if (!user) {
      throw new AppError(status.UNAUTHORIZED, "User not authenticated");
    }

    // get this user information :
    const isUserExists = await db.user.findFirst({
      where: {
        email: user.email,
        role: user.role as any,
        userStatus: "active",
      },
    });

    if (!isUserExists) {
      throw new AppError(status.NOT_FOUND, "User not found!");
    }

    return sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Login successful!",
      data: {
        ...user,
        ...isUserExists,
        password: "",
      },
    });
  }),
);
