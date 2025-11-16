import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import { validateZodSchema } from "../../middlewares/validate-schema";
import {
  getTestimonialDetailsParamsSchema,
  type GetTestimonialDetailsParamsType,
} from "../../schemas/testimonials";
import AppError from "../../classes/AppError";

/**
 * GET /testimonials/:id - Get testimonial details by ID (Public access)
 */
export const getTestimonialDetailsRoute = express.Router();

getTestimonialDetailsRoute.get(
  "/:id",
  validateZodSchema({ params: getTestimonialDetailsParamsSchema }),
  catchAsync(async (req, res, next) => {
    const { id } = req.params as GetTestimonialDetailsParamsType;

    const testimonial = await db.testimonial.findUnique({
      where: { id },
      include: {
        image: {
          select: {
            id: true,
            url: true,
            publicId: true,
            folder: true,
            altText: true,
            width: true,
            height: true,
            format: true,
            size: true,
            createdAt: true,
          },
        },
      },
    });

    if (!testimonial) {
      throw new AppError(httpStatus.NOT_FOUND, "Testimonial not found");
    }

    // For public access, don't return inactive testimonials
    if (!testimonial.isActive) {
      throw new AppError(httpStatus.NOT_FOUND, "Testimonial not found");
    }

    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Testimonial details retrieved successfully",
      data: testimonial,
    });
  })
);
