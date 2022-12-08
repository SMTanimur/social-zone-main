import { Express, NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/api-error';
import {STATUS} from '../constants/status'
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found- ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const printError = (error: string) => {
  try {
    return JSON.parse(error);
  } catch (err) {
    return error;
  }
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  if (error instanceof ApiError) {
    return res.status(error.status).json({ message: error.message });
  }
  res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
  
  res.status(statusCode);
  res.json({
    message: printError(error.message),
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
};

export const errorMiddleware = (app: Express) => {
  app.use(notFound);
  app.use(errorHandler);
};
