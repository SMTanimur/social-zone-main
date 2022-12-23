
import { Request, Response } from "express";
import postService from "../services/post.service";
import { catchAsync } from "../utils/catch-async";
import { responseSuccess } from "../utils/response";
//@desc  user can create new post
//@route  /api/post/create
//@access  Private
const createPost = catchAsync(async (req: Request, res: Response) => {
  const response = await postService.newPostCreate(req);
  responseSuccess(res, response);
});
/** 
@desc  user can update his post
@route /api/post/:postId
@access  Private
*/
const updatePost =catchAsync(async(req:Request,res:Response)=>{
  const response = await postService.updatePost(req)
  responseSuccess(res,response)
})



//@desc getUserPost by userId
//@route  /api/post/:username
//@access  Private

const getUserPosts = catchAsync(async(req:Request,res:Response)=>{
  const response = await postService.getUserPost(req)
  responseSuccess(res,response)
})

/**
 * @description Like on post
 * @route  POST /api/post/like/:postId
 * @access  Private
 */

const LikeOnPost = catchAsync(async(req:Request,res:Response)=>{
  const response = await postService.postLike(req)
  responseSuccess(res,response)
})

/**
 * @description  delete your post by postId
 * @route DELETE /post/:postId
 * @access  Private
 */

const DeletePost= catchAsync(async(req:Request,res:Response)=>{
  const response = await postService.deletePost(req)
  responseSuccess(res,response)
})

/**
 * @description  user get a single post
 * @route  GET /api/post/:postId
 * @access  Private
 */

  const getPost= catchAsync(async(req:Request,res:Response)=>{
    const response = await postService.getSinglePost(req)
    responseSuccess(res,response)
  })

  /**
   * @description  get  Likes on a single post
   * @route  GET /api/post/likes/:postId
   * @access  Private
   */

  const GetLikesOnPost = catchAsync(async(req:Request,res:Response)=>{
    const response = await postService.getPostLikes(req)
    responseSuccess(res,response)
  })
const postController = {
  createPost,
  updatePost,
  getUserPosts,
  LikeOnPost,
  DeletePost,
  getPost,
  GetLikesOnPost
};
export default postController;
