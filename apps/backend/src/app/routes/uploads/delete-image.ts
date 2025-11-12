import { v2 as cloudinary } from "cloudinary";
import { deleteFromCloudinaryByPublicId } from "../../utils";
import express from "express";

export const uploadRoutes = express.Router();

uploadRoutes.delete("/delete", async (req, res) => {
  // Extract publicId from the request body for security (avoids exposure in URL).
  const { publicId } = req.body;

  // Validate the input
  if (!publicId || typeof publicId !== "string") {
    return res.status(400).json({
      success: false,
      message: 'Invalid or missing "publicId" in the request body.',
    });
  }

  try {
    console.log(`Received request to delete image with publicId: ${publicId}`);

    const result = await deleteFromCloudinaryByPublicId(publicId, "image");

    console.log({ result });

    // If the resource was not found, the operation is still a "success"
    // because the desired state (the image being gone) is achieved.
    if (result.result === "not found") {
      return res.status(200).json({
        success: true,
        message: `Image with publicId '${publicId}' was not found, but is considered deleted.`,
      });
    }

    // If the deletion was successful
    return res.status(200).json({
      success: true,
      message: `Image with publicId '${publicId}' has been deleted successfully.`,
    });
  } catch (error) {
    // Handle any errors thrown from the deletion logic
    console.error(`Server error during deletion of ${publicId}:`, error);
    return res.status(500).json({
      success: false,
      message:
        (error as Error)?.message ||
        "An internal server error occurred while deleting the image.",
    });
  }
});
