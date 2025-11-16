// src/app/routes/sliders/update-slider.ts
import express from "express";
import { z } from "zod";
import { catchAsync, sendApiResponse } from "../../utils";
import { validateZodSchema } from "../../middlewares";
import { auth } from "../../middlewares/auth";
import { updateHeroSliderSchema } from "../../schemas/hero-sliders";
import type { updateHeroSliderType } from "../../schemas/hero-sliders";
import { db } from "../../db";
import status from "http-status";
import AppError from "../../classes/AppError";

const updateSliderRoute = express.Router();

updateSliderRoute.patch(
  "/:id",
  auth(["admin", "superadmin"]),
  validateZodSchema({
    params: z.object({ id: z.string() }),
    body: updateHeroSliderSchema,
  }),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body as updateHeroSliderType;
    const currentUserId = req.user?.id || null;

    // Validate ID is a number
    if (!id) {
      throw new AppError(status.BAD_REQUEST, "Slider ID is required");
    }
    const sliderId = parseInt(id);
    if (isNaN(sliderId)) {
      throw new AppError(status.BAD_REQUEST, "Invalid slider ID");
    }

    // Check if slider exists with image
    const existingSlider = await db.heroSlider.findUnique({
      where: { id: sliderId },
      include: { image: true },
    });

    if (!existingSlider) {
      throw new AppError(status.NOT_FOUND, "Slider not found");
    }

    // Extract image data and content data
    const {
      image,
      orderNumber: newOrderNumber,
      ...contentData
    }: updateHeroSliderType = updateData;

    // Check if there's actually anything to update
    const hasContentUpdates = Object.values(contentData).some(
      (value) => value !== undefined,
    );
    const hasImageUpdate = !!image;
    const hasOrderUpdate =
      newOrderNumber !== undefined &&
      newOrderNumber !== existingSlider.orderNumber;

    if (!hasContentUpdates && !hasImageUpdate && !hasOrderUpdate) {
      throw new AppError(status.BAD_REQUEST, "No update data provided");
    }

    // Update with atomic transaction
    const result = await db.$transaction(async (tx) => {
      let newImageId: string | undefined;

      // Handle image update if provided
      if (image) {
        if (!image.url) {
          throw new AppError(status.BAD_REQUEST, "Image URL is required");
        }

        // Delete old image from DB if it exists
        if (existingSlider.image) {
          await tx.image.delete({ where: { id: existingSlider.image.id } });
        }

        // Create new image record
        const newImageRecord = await tx.image.create({
          data: {
            url: image.url,
            publicId: image.publicId || `slider_${Date.now()}`,
            folder: image.folder || "app/hero-sliders",
            altText: image.altText || existingSlider.title,
            width: image.width,
            height: image.height,
            format: image.format,
            size: image.size,
          },
        });

        newImageId = newImageRecord.id;
      }

      // Handle order number update atomically
      let finalOrderNumber = existingSlider.orderNumber;

      if (hasOrderUpdate && newOrderNumber !== undefined) {
        const oldOrder = existingSlider.orderNumber;

        // Validate new order number
        if (newOrderNumber < 1) {
          throw new AppError(
            status.BAD_REQUEST,
            "Order number must be greater than 0",
          );
        }

        // Get total count to validate maximum order
        const totalCount = await tx.heroSlider.count();

        // Clamp the new order number to valid range
        finalOrderNumber = Math.min(newOrderNumber, totalCount);

        if (oldOrder !== finalOrderNumber) {
          if (finalOrderNumber < oldOrder) {
            // Moving up (smaller order number)
            // Shift sliders between new position and old position down
            await tx.heroSlider.updateMany({
              where: {
                AND: [
                  { orderNumber: { gte: finalOrderNumber } },
                  { orderNumber: { lt: oldOrder } },
                  { id: { not: sliderId } },
                ],
              },
              data: {
                orderNumber: { increment: 1 },
                modifiedBy: currentUserId,
              },
            });
          } else {
            // Moving down (larger order number)
            // Shift sliders between old position and new position up
            await tx.heroSlider.updateMany({
              where: {
                AND: [
                  { orderNumber: { gt: oldOrder } },
                  { orderNumber: { lte: finalOrderNumber } },
                  { id: { not: sliderId } },
                ],
              },
              data: {
                orderNumber: { decrement: 1 },
                modifiedBy: currentUserId,
              },
            });
          }
        }
      }

      // Update the slider
      const updatedSlider = await tx.heroSlider.update({
        where: { id: sliderId },
        data: {
          ...contentData,
          ...(newImageId && { imageId: newImageId }),
          ...(hasOrderUpdate && { orderNumber: finalOrderNumber }),
          modifiedBy: currentUserId,
        },
        include: {
          image: true,
        },
      });

      // Get all sliders to return the updated list
      const allSliders = await tx.heroSlider.findMany({
        include: { image: true },
        orderBy: { orderNumber: "asc" },
      });

      return {
        updatedSlider,
        allSliders,
        totalCount: allSliders.length,
      };
    });

    sendApiResponse(res, {
      status: status.OK,
      success: true,
      message: "Slider updated successfully",
      data: result,
    });
  }),
);

export default updateSliderRoute;
