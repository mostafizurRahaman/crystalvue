/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";

import { env } from "../configs/env";
import { IErrorSource } from "../types/error-response";
import handleZodError from "../errors/handle-zod-error";
import handlePrismaError from "../errors/handle-prisma-error";
import AppError from "../classes/AppError";

const globalErrorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  // Default values
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message: string = "Something Went Wrong!";
  let errorSources: IErrorSource[] = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }
  // Handle Prisma errors
  else if (
    err.code &&
    typeof err.code === "string" &&
    err.code.startsWith("P")
  ) {
    const simplifiedError = handlePrismaError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }
  // Handle custom AppError
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }
  // Handle generic Error instances
  else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  // Send error response
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: env.NODE_ENV === "development" ? err.stack : null,
  });
};

export default globalErrorHandler;
