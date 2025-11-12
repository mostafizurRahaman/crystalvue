// src/app/routes/sliders/bulk-delete-sliders.ts
import express from "express";
import { catchAsync, sendApiResponse } from "../../utils";
import { auth } from "../../middlewares/auth";
import { db } from "../../db";
import status from "http-status";
import AppError from "../../classes/AppError";
import { z } from "zod";
import { validateZodSchema } from "../../middlewares";

const bulkDeleteSlidersRoute = express.Router();

const bulkDeleteSchema = z.object({
  ids: z
    .array(z.number().int().positive())
    .min(1, "At least one slider ID is required"),
});

bulkDeleteSlidersRoute.post(
  "/bulk-delete",
  auth(["admin", "superadmin"]),
  validateZodSchema({ body: bulkDeleteSchema }),
  catchAsync(async (req, res) => {
    const { ids } = req.body;
    const currentUserId = req.user?.id || null;

    // Check if all sliders exist
    const existingSliders = await db.heroSlider.findMany({
      where: { id: { in: ids } },
      include: { image: true },
      orderBy: { orderNumber: "asc" },
    });

    if (existingSliders.length !== ids.length) {
      const foundIds = existingSliders.map((s) => s.id);
      const missingIds = ids.filter((id: number) => !foundIds.includes(id));
      throw new AppError(
        status.NOT_FOUND,
        `Sliders with IDs ${missingIds.join(", ")} not found`,
      );
    }

    // Handle bulk deletion with atomic order normalization
    const result = await db.$transaction(async (tx) => {
      const deletedOrderNumbers = existingSliders
        .map((s) => s.orderNumber)
        .sort((a, b) => a - b);

      // Delete all images first
      const imageIds = existingSliders
        .map((s) => s.image?.id)
        .filter((id): id is string => !!id);

      if (imageIds.length > 0) {
        await tx.image.deleteMany({ where: { id: { in: imageIds } } });
      }

      // Delete all sliders
      await tx.heroSlider.deleteMany({
        where: { id: { in: ids } },
      });

      // Normalize order numbers for remaining sliders
      let shiftAmount = 0;
      for (const deletedOrder of deletedOrderNumbers) {
        await tx.heroSlider.updateMany({
          where: {
            orderNumber: { gt: deletedOrder - shiftAmount },
          },
          data: {
            orderNumber: { decrement: 1 },
            modifiedBy: currentUserId,
          },
        });
        shiftAmount++;
      }

      // Get remaining sliders
      const remainingSliders = await tx.heroSlider.findMany({
        include: { image: true },
        orderBy: { orderNumber: "asc" },
      });

      return {
        deletedSliderIds: ids,
        deletedOrderNumbers,
        remainingSliders,
        totalRemaining: remainingSliders.length,
      };
    });

    sendApiResponse(res, {
      status: status.OK,
      success: true,
      message: `${ids.length} slider(s) deleted and order normalized successfully`,
      data: result,
    });
  }),
);

export default bulkDeleteSlidersRoute;
