// src/app/routes/sliders/delete-slider.ts
import express from "express";
import {
  catchAsync,
  deleteFromCloudinaryByPublicId,
  sendApiResponse,
} from "../../utils";
import { auth } from "../../middlewares/auth";
import { db } from "../../db";
import status from "http-status";
import AppError from "../../classes/AppError";

const deleteSliderRoute = express.Router();

deleteSliderRoute.delete(
  "/:id",
  auth(["admin", "superadmin"]),
  catchAsync(async (req, res) => {
    const { id } = req.params;
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

    // Delete from Cloudinary first (external service call)
    let cloudinaryDeletionResult = null;
    if (existingSlider.image) {
      try {
        cloudinaryDeletionResult = await deleteFromCloudinaryByPublicId(
          existingSlider.image.publicId,
          "image"
        );
        console.log(
          `Successfully deleted Cloudinary image: ${existingSlider.image.publicId}`
        );
      } catch (cloudinaryError) {
        // Log the error but continue with DB deletion for cleanup
        console.error(
          `Failed to delete Cloudinary image: ${cloudinaryError instanceof Error ? cloudinaryError.message : "Unknown error"}`
        );
        // Don't throw error here - we still want to clean up the database
      }
    }

    // Handle atomic database operations only in the transaction
    const result = await db.$transaction(async (tx) => {
      const deletedOrderNumber = existingSlider.orderNumber;

      // Step 1: Delete image from DB
      if (existingSlider.image) {
        await tx.image.delete({ where: { id: existingSlider.image.id } });
      }

      // Step 2: Delete the slider
      await tx.heroSlider.delete({
        where: { id: sliderId },
      });

      // Step 3: Shift all sliders with higher order numbers down by 1
      await tx.heroSlider.updateMany({
        where: {
          orderNumber: { gt: deletedOrderNumber },
        },
        data: {
          orderNumber: { decrement: 1 },
          modifiedBy: currentUserId,
        },
      });

      // Get remaining sliders
      const remainingSliders = await tx.heroSlider.findMany({
        include: { image: true },
        orderBy: { orderNumber: "asc" },
      });

      return {
        deletedSliderId: sliderId,
        deletedOrderNumber,
        remainingSliders,
        totalRemaining: remainingSliders.length,
        cloudinaryDeletion: cloudinaryDeletionResult,
      };
    });

    sendApiResponse(res, {
      status: status.OK,
      success: true,
      message:
        "Slider deleted atomically with Cloudinary cleanup and order normalization",
      data: result,
    });
  })
);

export default deleteSliderRoute;
