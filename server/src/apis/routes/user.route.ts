import { Router } from "express";
import userController from "../controllers/user.controller";
import tokenMiddleware from "../middlewares/session.middleware";

const userRoute = Router();

userRoute.get("/:username", userController.GetUser);
userRoute.patch("/:username/edit",  userController.updateMe);
userRoute.delete("/:id", userController.deleteAccount);
userRoute.get("/",  userController.getUserInfo);
export default userRoute;
