import { Router } from "express";
import authControllers from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import tokenMiddleware from "../middlewares/token.middleware";

const authRoutes = Router();

authRoutes.post(
  "/sign-up",
  authMiddleware.signUpRules(),
  authMiddleware.rateLimitRequest.signUp,
  authControllers.SignUp,
);

authRoutes.post(
  "/sign-in",
  authMiddleware.signInRules(),
  authMiddleware.rateLimitRequest.signIn,
  authControllers.signIN,
);

authRoutes.get("/logout", tokenMiddleware.verifyToken, authControllers.logOut);

export default authRoutes;
