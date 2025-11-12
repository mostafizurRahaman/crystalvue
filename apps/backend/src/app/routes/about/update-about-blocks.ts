import express from "express";
import httpStatus from "http-status";
import { db } from "../../db";
import { auth } from "../../middlewares/auth";
import { catchAsync, sendApiResponse } from "../../utils";
import { updateAboutBlocksSchema } from "../../schemas/about";
import { validateZodSchema } from "../../middlewares/validate-schema";
import AppError from "../../classes/AppError";
import { handleImageSave } from "../../utils/image-helpers";

/**
 * PUT /about/blocks - Update vision and mission blocks (Admin/Super Admin only)
 */
export const updateAboutBlocksRoute = express.Router();

updateAboutBlocksRoute.put(
  "/",
  auth(["admin", "superadmin"]),
  validateZodSchema({ body: updateAboutBlocksSchema }),
  catchAsync(async (req, res, next) => {
    const { vision, mission } = req.body;

    // Get existing blocks before transaction to avoid extra queries inside
    const [existingVisionBlock, existingMissionBlock] = await Promise.all([
      db.aboutBlock.findUnique({
        where: { type: "VISION" },
        include: { image: true },
      }),
      db.aboutBlock.findUnique({
        where: { type: "MISSION" },
        include: { image: true },
      }),
    ]);

    // Handle image saves outside transaction to determine image IDs
    const [visionImageId, missionImageId] = await Promise.all([
      handleImageSave(
        existingVisionBlock?.imageId,
        vision.image,
        undefined // No transaction client - use regular db
      ),
      handleImageSave(
        existingMissionBlock?.imageId,
        mission.image,
        undefined // No transaction client - use regular db
      ),
    ]);

    // Now do the upserts in a transaction (fast database operations only)
    const result = await db.$transaction(async (tx) => {
      const [updatedVision, updatedMission] = await Promise.all([
        tx.aboutBlock.upsert({
          where: { type: "VISION" },
          update: {
            title: vision.title,
            content: vision.content,
            imageId: visionImageId,
            isActive: vision.isActive ?? true,
          },
          create: {
            type: "VISION",
            title: vision.title,
            content: vision.content,
            imageId: visionImageId,
            isActive: true,
          },
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
        tx.aboutBlock.upsert({
          where: { type: "MISSION" },
          update: {
            title: mission.title,
            content: mission.content,
            imageId: missionImageId,
            isActive: mission.isActive ?? true,
          },
          create: {
            type: "MISSION",
            title: mission.title,
            content: mission.content,
            imageId: missionImageId,
            isActive: true,
          },
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

      return { vision: updatedVision, mission: updatedMission };
    });

    // Clean up old images from Cloudinary after transaction (non-blocking)
    // Only delete if we had old images and new images were provided
    const oldImagesToDelete: Array<{ publicId: string; type: string }> = [];

    if (vision.image && existingVisionBlock?.image?.publicId) {
      // Check if image actually changed
      if (!vision.image.id || vision.image.id !== existingVisionBlock.imageId) {
        oldImagesToDelete.push({
          publicId: existingVisionBlock.image.publicId,
          type: "vision",
        });
      }
    }

    if (mission.image && existingMissionBlock?.image?.publicId) {
      // Check if image actually changed
      if (
        !mission.image.id ||
        mission.image.id !== existingMissionBlock.imageId
      ) {
        oldImagesToDelete.push({
          publicId: existingMissionBlock.image.publicId,
          type: "mission",
        });
      }
    }

    // Delete old images from Cloudinary (fire and forget)
    if (oldImagesToDelete.length > 0) {
      const { deleteFromCloudinaryByPublicId } = await import(
        "../../utils/delete-image-by-public-id"
      );

      oldImagesToDelete.forEach(({ publicId, type }) => {
        deleteFromCloudinaryByPublicId(publicId, "image")
          .then(() => {
            console.log(
              `Successfully deleted old ${type} block image: ${publicId}`
            );
          })
          .catch((error) => {
            console.error(
              `Failed to delete old ${type} block image from Cloudinary: ${error instanceof Error ? error.message : "Unknown error"}`
            );
          });
      });
    }

    return sendApiResponse(res, {
      status: httpStatus.OK,
      success: true,
      data: result,
      message: "About blocks updated successfully",
    });
  })
);
