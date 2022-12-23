import { Router } from "express";
import { schemas, validateBody } from "../../validators/validations";
import postController from "../controllers/post.controller";
import sessionMiddleware from "../middlewares/session.middleware";

const postRoute = Router();

postRoute.post("/", validateBody(schemas.createPostSchema), postController.createPost);
postRoute.patch(
  "/:postId",
  sessionMiddleware.validateObjectID("postId"),
  validateBody(schemas.createPostSchema),
  postController.updatePost,
);
postRoute.get("/:username", postController.getUserPosts);
postRoute.post(
  "/like/:postId",
  sessionMiddleware.validateObjectID("postId"),
  postController.LikeOnPost,
);
postRoute.delete(
  "/:postId",
  sessionMiddleware.validateObjectID("postId"),
  postController.DeletePost,
);
postRoute.get("/:postId", sessionMiddleware.validateObjectID("postId"), postController.getPost);
postRoute.get(
  "/likes/:postId",
  sessionMiddleware.validateObjectID("postId"),
  postController.GetLikesOnPost,
);
export default postRoute;
