import { RequestHandler } from "express";
import httpStatus from "http-status";

/**
 * Global 404 Not Found Handler
 * --------------------------------------
 * This middleware handles any incoming requests
 * that don't match an existing route in the application.
 * It returns a standardized JSON error response
 * for better client-side error handling.
 */
export const notFoundHandler: RequestHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    statusCode: httpStatus.NOT_FOUND,
    error: "Not Found",
    message: `The requested route [${req.originalUrl}] was not found on this server.`,
    timestamp: new Date().toISOString(),
    ipv4: req.ip,
  });
};
