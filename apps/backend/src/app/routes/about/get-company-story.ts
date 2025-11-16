import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import AppError from "../../classes/AppError";

/**
 * GET /about/story - Get company story (Public access)
 * Returns company story content
 */
export const getCompanyStoryRoute = express.Router();

getCompanyStoryRoute.get(
  "/",
  catchAsync(async (req, res, next) => {
    // Get company story (associated with about page id: 1)
    const companyStory = await db.companyStory.findUnique({
      where: { aboutPageId: 1 },
      include: {
        leftImage: {
          select: {
            id: true,
            url: true,
            publicId: true,
            altText: true,
            width: true,
            height: true,
            format: true,
          },
        },
      },
    });

    if (!companyStory) {
      throw new AppError(httpStatus.NOT_FOUND, "Company story not found");
    }

    return sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      data: {
        companyStory,
      },
      message: "Company story retrieved successfully",
    });
  }),
);
