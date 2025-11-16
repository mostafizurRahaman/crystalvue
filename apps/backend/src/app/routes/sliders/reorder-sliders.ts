// src/app/routes/sliders/reorder-sliders.ts
import express from "express";
import { catchAsync, sendApiResponse } from "../../utils";
import { auth } from "../../middlewares/auth";
import { db } from "../../db";
import status from "http-status";
import AppError from "../../classes/AppError";
import { z } from "zod";
import { validateZodSchema } from "../../middlewares";

const reorderSlidersRoute = express.Router();

const swapSlidersSchema = z.object({
  sliderId1: z.number().int().positive(),
  sliderId2: z.number().int().positive(),
});

// Swap two sliders' positions
reorderSlidersRoute.put(
  "/swap",
  auth(["admin", "superadmin"]),
  validateZodSchema({ body: swapSlidersSchema }),
  catchAsync(async (req, res) => {
    const { sliderId1, sliderId2 } = req.body;
    const currentUserId = req.user?.id || null;

    if (sliderId1 === sliderId2) {
      throw new AppError(
        status.BAD_REQUEST,
        "Cannot swap a slider with itself",
      );
    }

    const result = await db.$transaction(async (tx) => {
      // Get both sliders
      const [slider1, slider2] = await Promise.all([
        tx.heroSlider.findUnique({ where: { id: sliderId1 } }),
        tx.heroSlider.findUnique({ where: { id: sliderId2 } }),
      ]);

      if (!slider1 || !slider2) {
        throw new AppError(status.NOT_FOUND, "One or both sliders not found");
      }

      // Swap order numbers
      await Promise.all([
        tx.heroSlider.update({
          where: { id: sliderId1 },
          data: {
            orderNumber: slider2.orderNumber,
            modifiedBy: currentUserId,
          },
        }),
        tx.heroSlider.update({
          where: { id: sliderId2 },
          data: {
            orderNumber: slider1.orderNumber,
            modifiedBy: currentUserId,
          },
        }),
      ]);

      return {
        swapped: {
          slider1: { id: sliderId1, newOrder: slider2.orderNumber },
          slider2: { id: sliderId2, newOrder: slider1.orderNumber },
        },
      };
    });

    sendApiResponse(res, {
      status: status.OK,
      success: true,
      message: "Sliders swapped successfully",
      data: result,
    });
  }),
);

export default reorderSlidersRoute;
