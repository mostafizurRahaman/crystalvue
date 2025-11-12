import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { catchAsync, sendApiResponse } from "../../utils";
import {
  getBulkTestimonialsQuerySchema,
  type GetBulkTestimonialsQueryType,
} from "../../schemas/testimonials";

/**
 * GET /testimonials/bulk/export - Get bulk testimonials for export by IDs (admin/superadmin only)
 * Accepts comma-separated IDs and returns individual testimonials
 */
export const getBulkTestimonialsForExport = catchAsync(
  async (req, res, next) => {
    // Use validated query data
    const queryData = req.query as unknown as GetBulkTestimonialsQueryType;

    const { ids } = queryData;
    const idsArray = Array.isArray(ids) ? ids : (typeof ids === 'string' ? [ids] : []);
    console.log("Original IDS:", ids, "Type:", typeof ids, "Is array:", Array.isArray(ids));
    console.log("Processed IDS:", idsArray, "Is array:", Array.isArray(idsArray));
    // Build where conditions
    const where: any = {};

    if (idsArray.length > 0) {
      where.id = {
        in: idsArray
      };
    } else {
      // If no IDs provided, return empty result
      sendApiResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "No testimonial IDs provided",
        data: [],
        pagination: {
          page: 1,
          limit: 0,
          total_items: 0,
          total_pages: 0,
        },
      });
      return;
    }

    const testimonials = await db.testimonial.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
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
          },
        },
      },
    });

    // Return response similar to get-all-testimonials single row pattern
    sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Testimonials retrieved successfully",
      data: testimonials,
      pagination: {
        page: 1,
        limit: testimonials.length,
        total_items: testimonials.length,
        total_pages: 1,
      },
    });
  }
);

export default getBulkTestimonialsForExport;
