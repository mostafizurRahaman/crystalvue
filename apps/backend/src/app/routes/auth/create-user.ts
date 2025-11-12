import express from "express";
import { catchAsync, hashPassword, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";
import httpStatus from "http-status";
import { db } from "../../db";

// define router
export const createUserRoute = express.Router();

createUserRoute.post(
  "/",
  catchAsync(async (req, res) => {
    const { name, email, password, profileUrl } = req.body;

    // check is user already exist with this email:
    const isUserExists = await db.user.findUnique({
      where: { email },
    });

    if (isUserExists) {
      throw new AppError(
        httpStatus.CONFLICT,
        "User already exist with this email!",
      );
    }

    // convert password to hash :
    const hashedPassword = await hashPassword(password);

    // create the user :
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profileUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    sendApiResponse(res, {
      status: httpStatus.CREATED,
      success: true,
      message: "User created successfully",
      data: user,
    });
  }),
);
