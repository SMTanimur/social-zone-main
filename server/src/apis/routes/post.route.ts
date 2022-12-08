import { Router } from "express";
import postController from "../controllers/post.controller";



const postRoute = Router()

postRoute.post('/create',postController.createPost)
postRoute.patch('/:id',postController.updatePost)
postRoute.delete('/:id',postController.deletePost)
postRoute.get('/timeline',postController.getPosts)
postRoute.get('/:id',postController.getPost)
postRoute.get('/all/:userId',postController.getUserPosts)
postRoute.post('/:id/like',postController.postLikeControl)
postRoute.post('/:id',postController.commentCreate)
postRoute.delete('/:postId/:commentId',postController.commentDelete)
export default postRoute