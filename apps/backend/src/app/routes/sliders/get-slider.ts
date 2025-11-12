// src/app/routes/sliders/get-slider.ts
import express from "express";
import { catchAsync, sendApiResponse } from "../../utils";
import { auth } from "../../middlewares/auth";
import { db } from "../../db";
import status from "http-status";
import AppError from "../../classes/AppError";

const getSliderRoute = express.Router();

getSliderRoute.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;

    // Validate ID is a number
    if (!id) {
      throw new AppError(status.BAD_REQUEST, "Slider ID is required");
    }
    const sliderId = parseInt(id);
    if (isNaN(sliderId)) {
      throw new AppError(status.BAD_REQUEST, "Invalid slider ID");
    }

    // Get slider with user and image information
    const slider = await db.heroSlider.findUnique({
      where: { id: sliderId },
      include: {
        image: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        modifiedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!slider) {
      throw new AppError(status.NOT_FOUND, "Slider not found");
    }

    sendApiResponse(res, {
      status: status.OK,
      success: true,
      message: "Slider retrieved successfully",
      data: slider,
    });
  }),
);

export default getSliderRoute;
