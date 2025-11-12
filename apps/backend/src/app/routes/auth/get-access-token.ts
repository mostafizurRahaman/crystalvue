import express from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { db } from "../../db";
import { env } from "../../configs/env";
import { catchAsync, createToken, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";

export const getAccessTokenRoute = express.Router();

getAccessTokenRoute.post(
  "/",
  catchAsync(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    // -------------------------------------------------------------------------
    // 1️⃣ Check if refresh token exists in cookies
    // -------------------------------------------------------------------------
    if (!refreshToken) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is required");
    }

    // -------------------------------------------------------------------------
    // 2️⃣ Verify refresh token
    // -------------------------------------------------------------------------
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Invalid or expired refresh token",
      );
    }

    // -------------------------------------------------------------------------
    // 3️⃣ Extract user info from token
    // -------------------------------------------------------------------------
    const { email, role } = decoded;

    // -------------------------------------------------------------------------
    // 4️⃣ Find user in database to ensure they still exist and are active
    // -------------------------------------------------------------------------
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    if (user.userStatus !== "active") {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Your account is not active. Please contact support.",
      );
    }

    // -------------------------------------------------------------------------
    // 5️⃣ Generate new access token
    // -------------------------------------------------------------------------
    const payload = { email: user.email, role: user.role };

    const newAccessToken = createToken(
      payload,
      env.ACCESS_TOKEN_SECRET,
      env.ACCESS_TOKEN_EXPIRES_IN,
    );

    // -------------------------------------------------------------------------
    // 6️⃣ Send response
    // -------------------------------------------------------------------------
    return sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Access token refreshed successfully!",
      data: {
        accessToken: newAccessToken,
      },
    });
  }),
);
