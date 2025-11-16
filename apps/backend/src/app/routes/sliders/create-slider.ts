// src/app/routes/sliders/create-slider.ts
import express from "express";
import { catchAsync, sendApiResponse } from "../../utils";
import { validateZodSchema } from "../../middlewares";
import { auth } from "../../middlewares/auth";
import {
  createHeroSliderSchema,
  type createHeroSliderType,
} from "../../schemas/hero-sliders";
import { db } from "../../db";
import status from "http-status";
import AppError from "../../classes/AppError";

const createSliderRoute = express.Router();

const MAX_SLIDERS = 15; // Maximum allowed sliders

createSliderRoute.post(
  "/",
  auth(["admin", "superadmin"]),
  validateZodSchema({ body: createHeroSliderSchema }),
  catchAsync(async (req, res) => {
    const {
      title,
      subtitle,
      image: imageData,
      orderNumber,
      buttonUrl,
      buttonText,
      isActive = true,
    } = req.body as createHeroSliderType;

    const currentUserId = req.user?.id || null;

    // Check slider count limit
    const sliderCount = await db.heroSlider.count();

    if (sliderCount >= MAX_SLIDERS) {
      throw new AppError(
        status.BAD_REQUEST,
        `Maximum of ${MAX_SLIDERS} sliders allowed. Please delete some existing sliders before adding new ones.`,
      );
    }

    // Handle slider creation with atomic transaction
    const result = await db.$transaction(async (tx) => {
      let finalOrderNumber = orderNumber;

      if (finalOrderNumber === undefined) {
        // If no order is specified, place it at the end
        const maxOrderResult = await tx.heroSlider.aggregate({
          _max: { orderNumber: true },
        });
        finalOrderNumber = (maxOrderResult._max.orderNumber || 0) + 1;
      } else {
        // Validate order number
        if (finalOrderNumber < 1) {
          throw new AppError(
            status.BAD_REQUEST,
            "Order number must be greater than 0",
          );
        }

        // Get the max order number to validate the input
        const maxOrderResult = await tx.heroSlider.aggregate({
          _max: { orderNumber: true },
        });
        const maxOrder = maxOrderResult._max.orderNumber || 0;

        // If order number is greater than max + 1, set it to max + 1
        if (finalOrderNumber > maxOrder + 1) {
          finalOrderNumber = maxOrder + 1;
        } else {
          // Shift existing sliders with order >= finalOrderNumber
          await tx.heroSlider.updateMany({
            where: {
              orderNumber: { gte: finalOrderNumber },
            },
            data: {
              orderNumber: { increment: 1 },
              modifiedBy: currentUserId,
            },
          });
        }
      }

      // Create image record first
      const imageRecord = await tx.image.create({
        data: {
          url: imageData.url,
          publicId: imageData.publicId || `slider_${Date.now()}`,
          folder: imageData.folder || "app/hero-sliders",
          altText: imageData.altText || title,
          width: imageData.width,
          height: imageData.height,
          format: imageData.format,
          size: imageData.size,
        },
      });

      // Create the new slider
      const newSlider = await tx.heroSlider.create({
        data: {
          title,
          subtitle,
          imageId: imageRecord.id,
          orderNumber: finalOrderNumber,
          buttonUrl,
          buttonText,
          isActive,
          userId: currentUserId,
          modifiedBy: currentUserId,
        },
        include: {
          image: true,
        },
      });

      return newSlider;
    });

    sendApiResponse(res, {
      status: status.CREATED,
      success: true,
      message: "Slider created successfully",
      data: result,
    });
  }),
);

export default createSliderRoute;
