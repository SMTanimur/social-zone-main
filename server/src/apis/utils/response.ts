
import { Response } from "express";
import { STATUS } from "../constants/status";

import { ApiError } from "./api-error";

export const responseSuccess = (res: Response, data: any) => {
  const status = data?.status || STATUS.OK;
  res.status(status).json({ status, success: true, ...data });
};

export const responseError = (err: ApiError, res: Response) => {
  const status = err.status || STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || "Server Error!";
  const error = err.error;
  return res.status(status).json({
    status,
    success: false,
    message,
    error,
  });
};
