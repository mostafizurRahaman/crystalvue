import httpStatus from "http-status";
import { ZodError } from "zod";
import { IErrorResponse } from "../types/error-response";

const handleZodError = (err: ZodError): IErrorResponse => {
  const errorSources = err.issues.map((issue) => {
    const lastPath = issue.path[issue.path.length - 1];
    return {
      path: lastPath as string,
      message: issue.message,
    };
  });

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Validation Error!!!",
    errorSources,
  };
};

export default handleZodError;
