import { STATUS } from "../constants/status";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils/api-error";
import env from "../../configs/env";
import { isValidObjectId } from "mongoose";

function isAuthenticated(req: any, res: any, next: NextFunction) {
  if (req.isAuthenticated()) {
    console.log("CHECK MIDDLEWARE: IS AUTH: ", req.isAuthenticated());
    return next();
  }

  return next(new ApiError(401, "unauthorized"));
}

function validateObjectID(...ObjectIDs) {
  return function (req: any, res: any, next: NextFunction) {
    ObjectIDs.forEach((id) => {
      if (!isValidObjectId(req.params[id])) {
        return next(new ApiError(400, `ObjectID ${id} supplied is not valid`));
      } else {
        next();
      }
    });
  };
}
const sessionMiddleware = {
  isAuthenticated,
  validateObjectID,
};
export default sessionMiddleware;
