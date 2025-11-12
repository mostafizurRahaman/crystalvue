// src/app/routes/sliders/get-sliders-batch.ts
import express from "express";
import { z } from "zod";
import { catchAsync, sendApiResponse } from "../../utils";
import { db } from "../../db";
import status from "http-status";

const getSlidersBatchRoute = express.Router();

// GET /api/sliders/batch?ids=1,2,3
getSlidersBatchRoute.get(
  "/batch",
  catchAsync(async (req, res) => {
    try {
      let ids: number[] = [];

      // Get IDs from query parameters (comma-separated)
      const idsParam = req.query.ids as string;

      if (idsParam) {
        ids = idsParam
          .split(",")
          .map((id) => parseInt(id.trim(), 10))
          .filter((id) => !isNaN(id));
      }

      if (ids.length === 0) {
        return sendApiResponse(res, {
          status: status.OK,
          success: true,
          message: "No valid IDs provided",
          data: [],
        });
      }

      // Fetch the sliders by IDs
      const sliders = await db.heroSlider.findMany({
        where: {
          id: { in: ids },
        },
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

      // Return the result
      sendApiResponse(res, {
        status: status.OK,
        success: true,
        message: "Sliders retrieved successfully",
        data: sliders,
      });
    } catch (error) {
      console.error("Error batch fetching sliders:", error);
      sendApiResponse(res, {
        status: status.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to fetch sliders",
        data: error instanceof Error ? error.message : String(error),
      });
    }
  }),
);

// Alternative POST implementation for larger ID sets
getSlidersBatchRoute.post(
  "/batch",
  catchAsync(async (req, res) => {
    try {
      const body = req.body;

      if (!Array.isArray(body.ids) || body.ids.length === 0) {
        return sendApiResponse(res, {
          status: status.OK,
          success: true,
          message: "No valid IDs provided",
          data: [],
        });
      }

      const ids = body.ids
        .map((id: any) => parseInt(id, 10))
        .filter((id: number) => !isNaN(id));

      if (ids.length === 0) {
        return sendApiResponse(res, {
          status: status.OK,
          success: true,
          message: "No valid IDs provided",
          data: [],
        });
      }

      // Process IDs in batches to avoid URL length limitations
      const BATCH_SIZE = 50;
      const sliders = [];

      // Process in batches
      for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        const batchIds = ids.slice(i, i + BATCH_SIZE);

        const batchSliders = await db.heroSlider.findMany({
          where: {
            id: { in: batchIds },
          },
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

        sliders.push(...batchSliders);
      }

      sendApiResponse(res, {
        status: status.OK,
        success: true,
        message: "Sliders retrieved successfully",
        data: sliders,
      });
    } catch (error) {
      console.error("Error batch fetching sliders:", error);
      sendApiResponse(res, {
        status: status.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to fetch sliders",
        data: error instanceof Error ? error.message : String(error),
      });
    }
  }),
);

export default getSlidersBatchRoute;
