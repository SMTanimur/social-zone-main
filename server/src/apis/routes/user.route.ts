import { Router } from "express";
import userController from "../controllers/user.controller";
import tokenMiddleware from "../middlewares/token.middleware";

const userRoute = Router();

userRoute.get("/:username", tokenMiddleware.verifyToken, userController.GetUser);
userRoute.post("/:id", tokenMiddleware.verifyToken, userController.updateMe);
userRoute.delete("/:id", tokenMiddleware.verifyToken, userController.deleteAccount);
userRoute.get("/", tokenMiddleware.verifyToken, userController.getUserInfo);
userRoute.get("/friends/:id", tokenMiddleware.verifyToken, userController.userFriends);
userRoute.get("/find", tokenMiddleware.verifyToken, userController.searchUsers);
userRoute.delete("/:id/friend", tokenMiddleware.verifyToken, userController.removeFriend);
export default userRoute;
