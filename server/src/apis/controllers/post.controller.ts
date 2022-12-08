
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

//@desc  user can update his post
//@route /api/post/:id
//@access  Private
const updatePost =catchAsync(async(req:Request,res:Response)=>{
  const response = await postService.updatePost(req,res)
  responseSuccess(res,response)
})

//@desc   Post delete by user
//@route /api/post/:id
//@access  Private

const deletePost = catchAsync(async(req:Request,res:Response)=>{
  const response = await postService.PostDelete(req,res)
  responseSuccess(res,response)
})

//@desc  post like by user
//@route  /api/post/:id
//@access  Private

const postLikeControl = catchAsync(async(req:Request,res:Response)=>{
  const response = await postService.likePost(req,res)
  responseSuccess(res,response)
})

//@desc  getUserPost by userId
//@route  /api/post/:id
//@access  Private
const getPost = catchAsync(async (req:Request,res:Response)=>{
  const response = await postService.getUserPost(req)
   responseSuccess(res,response)
})

//@desc getUserPost by userId
//@route  /api/post/all/:userId
//@access  Private

const getUserPosts = catchAsync(async(req:Request,res:Response)=>{
  const response = await postService.getUsersPosts(req)
  responseSuccess(res,response)
})

//@desc getPosts
//@route  /api/post/timeline
//@access Public

const getPosts =catchAsync(async(req:Request,res:Response)=>{
  const response = await postService.getPosts(req)
  responseSuccess(res,response)
})

//@desc comment create on post
//@route /api/post/:id
//@access  Private
 const commentCreate = catchAsync(async(req:Request,res:Response)=>{
  const response = await postService.createComment(req,res)
  responseSuccess(res,response)
 })

 //@desc comment delete 
//@route /api/post/:postId/:commentId
//@access Private

 const commentDelete = catchAsync(async(req:Request,res:Response)=>{
  const response = await postService.deletePostComment(req)
  responseSuccess(res,response)
 })
const postController = {
  createPost,
  updatePost,
  deletePost,
  postLikeControl,
  getPost,
  getUserPosts,
  commentCreate,
  commentDelete,
  getPosts
};
export default postController;
