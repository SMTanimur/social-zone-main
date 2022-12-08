import { body } from "express-validator";
import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import { responseError } from "../utils/response";
import { ApiError } from "../utils/api-error";
import { STATUS } from "../constants/status";

const signUpRules = () => {
  return [
    body("username")
      .isLength({ min: 5, max: 12 })
      .withMessage("username must be between 5-12 characters"),
    body("email")
      .isEmail()
      .withMessage("Email invalidate")
      .isLength({ min: 5, max: 160 })
      .withMessage("Email must be between 5-160 characters"),
    body("password")
      .exists({ checkFalsy: true })
      .withMessage("Password can not be blank")
      .isLength({ min: 6, max: 18 })
      .withMessage("Password must be between 6-18 characters"),
  ];
};

const signInRules = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Email invalidate")
      .isLength({ min: 5, max: 100 })
      .withMessage("Email must be between 5-18 characters"),
    body("password")
      .isLength({ min: 6, max: 160 })
      .withMessage("Password must be between 6-18 characters"),
  ];
};

const rateLimitRequest = {
  signUp: rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    max: 5,
    handler: function (req: Request, res: Response) {
      responseError(new ApiError(STATUS.TOO_MANY_REQUESTS, "Try again in 1 minute!"), res);
    },
  }),
  signIn: rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    max: 5,
    handler: function (req: Request, res: Response) {
      responseError(new ApiError(STATUS.TOO_MANY_REQUESTS, "Try again in 1 minute!"), res);
    },
  }),
};

const authMiddleware = { signUpRules, signInRules, rateLimitRequest };

export default authMiddleware;
