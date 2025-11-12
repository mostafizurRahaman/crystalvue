import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { verifyJwtToken } from "../utils";
import { env } from "../configs/env";
import AppError from "../classes/AppError";
import { JwtPayload } from "jsonwebtoken";
import { db } from "../db";

// Define a more specific user interface for the request
interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  userStatus: string;
}

// Extend the Request interface to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Enhanced authentication middleware with proper token validation and security checks
 * @param roles - Array of allowed roles. Empty array means any authenticated user can access
 */
export const auth = (roles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Validate authorization header format
      const authorization = req?.headers?.authorization;

      if (!authorization || typeof authorization !== "string") {
        throw new AppError(
          status.UNAUTHORIZED,
          "Authorization header is required",
        );
      }

      // 2. Extract and validate Bearer token format
      const authParts = authorization.split(" ");

      if (authParts.length !== 2 || authParts[0] !== "Bearer") {
        throw new AppError(
          status.UNAUTHORIZED,
          "Invalid authorization header format. Expected: 'Bearer <token>'",
        );
      }

      const bearerToken = authParts[1];

      if (!bearerToken || bearerToken.trim() === "") {
        throw new AppError(status.UNAUTHORIZED, "Token is required");
      }

      // 3. Verify JWT token with proper error handling
      let decoded: JwtPayload;
      try {
        decoded = verifyJwtToken(
          bearerToken,
          env.ACCESS_TOKEN_SECRET,
        ) as JwtPayload;
      } catch (jwtError) {
        // Handle specific JWT errors
        if (jwtError instanceof Error) {
          if (jwtError.name === "TokenExpiredError") {
            throw new AppError(status.UNAUTHORIZED, "Token has expired");
          } else if (jwtError.name === "JsonWebTokenError") {
            throw new AppError(status.UNAUTHORIZED, "Invalid token");
          } else if (jwtError.name === "NotBeforeError") {
            throw new AppError(status.UNAUTHORIZED, "Token not active");
          }
        }
        throw new AppError(status.UNAUTHORIZED, "Token verification failed");
      }

      // 4. Validate decoded token structure
      if (!decoded || !decoded.email || !decoded.role || !decoded.exp) {
        throw new AppError(status.UNAUTHORIZED, "Invalid token structure");
      }

      // 5. Validate token expiration (extra safety check)
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTimestamp) {
        throw new AppError(status.UNAUTHORIZED, "Token has expired");
      }

      // 6. Check if user exists and is active in database
      const user = await db.user.findFirst({
        where: {
          email: String(decoded.email),
          role: String(decoded.role) as any,
          userStatus: "active",
        },
        select: {
          id: true,
          email: true,
          role: true,
          userStatus: true,
        },
      });

      if (!user) {
        throw new AppError(
          status.UNAUTHORIZED,
          "User not found or account is not active",
        );
      }

      // 7. Validate user role permissions
      if (Array.isArray(roles) && roles.length > 0) {
        if (!roles.includes(user.role)) {
          throw new AppError(
            status.FORBIDDEN,
            `Access denied. Required roles: ${roles.join(", ")}`,
          );
        }
      }

      // 8. Set authenticated user to request object
      req.user = user;

      // 9. Log successful authentication for security monitoring (optional)
      console.log(
        `User authenticated: ${user.email} (${user.role}) - ${new Date().toISOString()}`,
      );

      next();
    } catch (error) {
      // Log security-related errors for monitoring
      if (error instanceof AppError) {
        console.warn(`Authentication failed: ${error.message}`);
      } else {
        console.error("Unexpected authentication error:", error);
      }
      next(error);
    }
  };
};
