import express, { NextFunction, Request, Response } from "express";
import sessionMiddleware from "../middlewares/session.middleware";
import tokenMiddleware from "../middlewares/session.middleware";
import { responseError } from "../utils/response";
import authRoutes from "./auth.route";
import followRoute from "./follow.route";
import postRoute from "./post.route";
import userRoute from "./user.route";

const appRoutes = express();

appRoutes.use("/api/auth", authRoutes);
appRoutes.use("/api/user", sessionMiddleware.isAuthenticated, userRoute);
appRoutes.use("/api",sessionMiddleware.isAuthenticated, followRoute)
appRoutes.use("/api/upload",sessionMiddleware.isAuthenticated)
appRoutes.use("/api/post", sessionMiddleware.isAuthenticated, postRoute);
appRoutes.use((err: any, req: Request, res: Response, next: NextFunction) => [
  responseError(err, res),
]);

export default appRoutes;
