import { Router } from "express";
import followControllers from "../controllers/follow.controller";
import sessionMiddleware from "../middlewares/session.middleware";

const followRoute = Router();

followRoute.post(
  "/follow/:follow_id",
  sessionMiddleware.validateObjectID("follow_id"),
  followControllers.followUser
);

followRoute.post(
  "/unfollow/:follow_id",
  sessionMiddleware.validateObjectID("follow_id"),
  followControllers.unFollowUser
),
  followRoute.get("/:username/followers", followControllers.getFollowers);
followRoute.get("/:username/following", followControllers.getFollowing);
followRoute.get("/people/suggest", followControllers.getSuggestPeople);

export default followRoute;
