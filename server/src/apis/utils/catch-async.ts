import { Request, Response, NextFunction } from "express";

export const catchAsync = (callback: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(callback(req, res, next)).catch((err) => next(err));
};
