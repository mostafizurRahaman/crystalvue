import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { env } from "../../configs/env";
import {
  catchAsync,
  compareHash,
  createToken,
  sendApiResponse,
} from "../../utils";
import AppError from "../../classes/AppError";

// -----------------------------------------------------------------------------
// ROUTER SETUP
// -----------------------------------------------------------------------------
export const loginUserRoute = express.Router();

loginUserRoute.post(
  "/",
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // -------------------------------------------------------------------------
    // 1️⃣ Check if user exists
    // -------------------------------------------------------------------------
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    // -------------------------------------------------------------------------
    // 2️⃣ Validate user status
    // -------------------------------------------------------------------------
    if (user.userStatus !== "active") {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Your account is pending. Please contact support.",
      );
    }

    // -------------------------------------------------------------------------
    // 3️⃣ Validate password
    // -------------------------------------------------------------------------
    const isPasswordMatched = await compareHash(password, user.password);
    if (!isPasswordMatched) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials!");
    }

    // -------------------------------------------------------------------------
    // 4️⃣ Generate tokens
    // -------------------------------------------------------------------------
    const payload = { email: user.email, role: user.role };

    const accessToken = createToken(
      payload,
      env.ACCESS_TOKEN_SECRET,
      env.ACCESS_TOKEN_EXPIRES_IN,
    );

    const refreshToken = createToken(
      payload,
      env.REFRESH_TOKEN_SECRET,
      env.REFRESH_TOKEN_EXPIRES_IN,
    );

    // -------------------------------------------------------------------------
    // 5️⃣ Send refresh token as cookie
    // -------------------------------------------------------------------------
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: env.NODE_ENV === "production", // 🔥 secure in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // -------------------------------------------------------------------------
    // 6️⃣ Send response
    // -------------------------------------------------------------------------
    console.log(user);
    return sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Login successful!",
      data: {
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.userStatus,
          profileUrl: user.profileUrl,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  }),
);
