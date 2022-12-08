import { STATUS } from "./../constants/status";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";


import { ApiError } from "../utils/api-error";
import env from "../../configs/env";


const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.green_sid;
  if (!token) throw new ApiError(STATUS.UNAUTHORIZED, "unAuthorized");

  const { id }: any = jwt.verify(token, env.passport.jwtSecretKey as string);
  res.locals.user = { id };
  next();
  // const { authorization } = req.headers;
  // if (!authorization || !authorization.startsWith('Bearer')) {
  //   throw new UnauthorizedError('Token not provided');
  // } else {
  //   const token = authorization.split(' ')[1];
  //   try {
  //     const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as {
  //       id: string;
  //     };
  //     req.user = {
  //       id,
  //     };
  //     next();
  //   } catch (error) {
  //     throw new UnauthorizedError('Invalid/Expired token');
  //   }
  // }
};
const tokenMiddleware = {
  verifyToken,
};
export default tokenMiddleware;
