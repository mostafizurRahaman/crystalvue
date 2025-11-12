import { Request, RequestHandler } from "express";
import { ZodError } from "zod";
import type { ZodSchema } from "zod";

export type SchemaTargets = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

const validateAndAssign = (
  schema: ZodSchema | undefined,
  data: unknown,
  fieldName: string,
  req: Request
): ZodError | null => {
  if (!schema) return null;

  console.log({ data });
  const result = schema.safeParse(data);
  if (!result.success) {
    return result.error;
  }

  // Assign parsed data back to request
  if (fieldName === "body") {
    req.body = result.data;
  } else if (fieldName === "params") {
    (req as any).params = result.data;
  } else if (fieldName === "query") {
    // Store validated query data in a custom property since req.query is read-only
    (req as any).validatedQuery = result.data;
  }

  return null;
};

export const validateZodSchema = (schemas: SchemaTargets): RequestHandler => {
  return (req, _res, next) => {
    try {
      // Validate each field and assign parsed data
      const bodyError = validateAndAssign(schemas.body, req.body, "body", req);
      const paramsError = validateAndAssign(
        schemas.params,
        req.params,
        "params",
        req
      );
      const queryError = validateAndAssign(
        schemas.query,
        req.query,
        "query",
        req
      );

      // Return the first error if any
      return next(bodyError || paramsError || queryError);
    } catch (error) {
      next(error);
    }
  };
};
