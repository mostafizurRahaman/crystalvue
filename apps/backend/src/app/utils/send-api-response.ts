import type { Response } from "express";
import type { IApiResponse } from "../types";

export const sendApiResponse = <T, K>(
  res: Response,
  data: IApiResponse<T, K>,
) => {
  return res.status(data.status).json({
    success: data.success,
    message: data.message,
    data: data.data,
    pagination: data.pagination,
    summary: data.summary || null,
  });
};
