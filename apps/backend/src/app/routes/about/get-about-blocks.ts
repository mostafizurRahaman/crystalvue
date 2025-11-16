import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";

/**
 * GET /about/blocks - Get vision and mission blocks (Public access)
 * Returns vision and mission blocks content
 */
export const getAboutBlocksRoute = express.Router();

getAboutBlocksRoute.get(
  "/",
  catchAsync(async (req, res) => {
    // Get both vision and mission blocks
    const [visionBlock, missionBlock] = await Promise.all([
      db.aboutBlock.findUnique({
        where: { type: "VISION" },
        include: {
          image: {
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
      }),
      db.aboutBlock.findUnique({
        where: { type: "MISSION" },
        include: {
          image: {
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
      }),
    ]);

    return sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      data: {
        visionBlock,
        missionBlock,
      },
      message: "About blocks retrieved successfully",
    });
  }),
);
