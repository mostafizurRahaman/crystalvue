import httpStatus from "http-status";
import { IErrorResponse } from "../types/error-response";

const handlePrismaError = (err: any): IErrorResponse => {
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR as number;
  let message = "Database Error!";
  const errorSources = [];

  // Prisma Error Codes
  switch (err.code) {
    case "P2002": // Unique constraint violation
      statusCode = httpStatus.CONFLICT;
      message = "Duplicate Entry Error!";
      const field = extractFieldName(err);
      errorSources.push({
        path: field,
        message: `${field} already exists`,
      });
      break;

    case "P2003": // Foreign key constraint violation
      statusCode = httpStatus.BAD_REQUEST;
      message = "Foreign Key Constraint Error!";
      errorSources.push({
        path: err.meta?.field_name || "relation",
        message: "Referenced record does not exist",
      });
      break;

    case "P2025": // Record not found
      statusCode = httpStatus.NOT_FOUND;
      message = "Record Not Found!";
      errorSources.push({
        path: "id",
        message: "The requested record does not exist",
      });
      break;

    case "P2014": // Required relation violation
      statusCode = httpStatus.BAD_REQUEST;
      message = "Required Relation Error!";
      errorSources.push({
        path: err.meta?.field_name || "relation",
        message: "Required relation is missing",
      });
      break;

    case "P2001": // Record not found for update/delete
      statusCode = httpStatus.NOT_FOUND;
      message = "Record Not Found!";
      errorSources.push({
        path: "id",
        message: "The record you're trying to update/delete does not exist",
      });
      break;

    case "P2016": // Query interpretation error
      statusCode = httpStatus.BAD_REQUEST;
      message = "Query Error!";
      errorSources.push({
        path: "query",
        message: "Invalid query parameters",
      });
      break;

    case "P2021": // Table does not exist
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = "Database Configuration Error!";
      errorSources.push({
        path: "table",
        message: "Table does not exist in database",
      });
      break;

    case "P2022": // Column does not exist
      statusCode = httpStatus.BAD_REQUEST;
      message = "Invalid Field Error!";
      errorSources.push({
        path: "column",
        message: "Column does not exist",
      });
      break;

    case "P2011": // Null constraint violation
      statusCode = httpStatus.BAD_REQUEST;
      message = "Required Field Missing!";
      errorSources.push({
        path: err.meta?.field_name || "field",
        message: `${err.meta?.field_name || "This field"} is required`,
      });
      break;

    case "P2012": // Missing required value
      statusCode = httpStatus.BAD_REQUEST;
      message = "Required Field Missing!";
      errorSources.push({
        path: err.meta?.field_name || "field",
        message: `${err.meta?.field_name || "This field"} is required`,
      });
      break;

    case "P2013": // Missing required argument
      statusCode = httpStatus.BAD_REQUEST;
      message = "Missing Required Argument!";
      errorSources.push({
        path: err.meta?.field_name || "argument",
        message: `${err.meta?.field_name || "This argument"} is required`,
      });
      break;

    case "P2015": // Record for relation not connected
      statusCode = httpStatus.BAD_REQUEST;
      message = "Relation Error!";
      errorSources.push({
        path: err.meta?.field_name || "relation",
        message: "Record for relation is not connected",
      });
      break;

    case "P2017": // Relation violation
      statusCode = httpStatus.BAD_REQUEST;
      message = "Relation Violation!";
      errorSources.push({
        path: err.meta?.field_name || "relation",
        message: "Relation violation occurred",
      });
      break;

    case "P2018": // Required connected records not found
      statusCode = httpStatus.BAD_REQUEST;
      message = "Required Connected Records Not Found!";
      errorSources.push({
        path: err.meta?.field_name || "relation",
        message: "Required connected records not found",
      });
      break;

    case "P2019": // Input error
      statusCode = httpStatus.BAD_REQUEST;
      message = "Input Error!";
      errorSources.push({
        path: err.meta?.field_name || "input",
        message: "Invalid input provided",
      });
      break;

    case "P2020": // Value out of range
      statusCode = httpStatus.BAD_REQUEST;
      message = "Value Out of Range!";
      errorSources.push({
        path: err.meta?.field_name || "field",
        message: "Value is out of acceptable range",
      });
      break;

    default:
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = "Database Operation Failed!";
      errorSources.push({
        path: "database",
        message: err.message || "An unknown database error occurred",
      });
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

// Helper: Extract field name from Prisma error
const extractFieldName = (err: any): string => {
  // Try to get from meta.target first
  if (err.meta?.target) {
    if (Array.isArray(err.meta.target)) {
      return err.meta.target.join(", ");
    }
    return err.meta.target;
  }

  // Try to get from meta.field_name
  if (err.meta?.field_name) {
    return err.meta.field_name;
  }

  // Try to extract from constraint name
  if (err.meta?.constraint) {
    return err.meta.constraint
      .replace(/_unique$/i, "")
      .replace(/_key$/i, "")
      .replace(/^unique_/i, "")
      .replace(/_pkey$/i, "")
      .replace(/^[^_]+_/i, ""); // Remove table name prefix
  }

  return "field";
};

export default handlePrismaError;
