import { Router } from "express";
import { schemas, validateBody } from "../../validators/validations";
import authControllers from "../controllers/auth.controller";
import sessionMiddleware from "../middlewares/session.middleware";


const authRoutes = Router();

authRoutes.post(
  "/sign-up",
  validateBody(schemas.registerSchema),
  authControllers.SignUp,
);

authRoutes.post(
  "/sign-in",
  validateBody(schemas.loginSchema),
  authControllers.login,
);

authRoutes.delete("/logout",sessionMiddleware.isAuthenticated , authControllers.logOut);
authRoutes.get("/check-session",sessionMiddleware.isAuthenticated , authControllers.checkSession);

export default authRoutes;
