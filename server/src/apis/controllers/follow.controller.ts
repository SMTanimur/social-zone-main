import { Request, Response } from "express";
import { USERS_LIMIT } from "../constants/limit";
import User from "../models/user";
import followService from "../services/follow.service";
import { catchAsync } from "../utils/catch-async";
import { responseSuccess } from "../utils/response";
//@desc user can follow
//@route  /api/follow/follow_id
//@access Private
const followUser = catchAsync(async (req: Request, res: Response) => {
  const response = await followService.follow(req);
  responseSuccess(res, response);
});

//@desc user can unfollow
//@route  /api/unfollow/follow_id
//@access Private

const unFollowUser = catchAsync(async (req: Request, res: Response) => {
  const response = await followService.unfollow(req);
  responseSuccess(res, response);
});
/***
 * @desc get following
 *@route POST /api/username/following
 * @access Private
 */

const getFollowing = catchAsync(async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const offset = parseInt(req.query.offset) || 0;
    const limit = USERS_LIMIT;
    const skip = offset * limit;
    const user = await User.findOne({ username });
    const response = await followService.getFollow(
      "following",
      { user: user?._id },
      req.user,
      skip,
      limit,
    );
    responseSuccess(res, response);
  } catch (error) {
    console.log(error)
  }
});

/**
 * @desc Get Followers
 * @route POST /api/username/follower
 * @access Private
 */

const getFollowers = catchAsync(async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const offset = parseInt(req.query.offset) || 0;
    const limit = USERS_LIMIT;
    const skip = offset * limit;
    const user = await User.findOne({ username });
    const response = await followService.getFollow(
      "following",
      { target: user?._id },
      req.user,
      skip,
      limit,
    );
    responseSuccess(res, response);
  } catch (error) {
    console.log(error)
  }
});

/**
 * @desc Get suggestion of people
 * @route GET  /people/suggested
 * @access Private
 */

 const getSuggestPeople = catchAsync(async(req:Request,res:Response)=>{
   const response = await followService.getSuggestPeople(req)
   responseSuccess(res,response)
 })
const followControllers = {
  followUser,
  unFollowUser,
  getFollowing,
  getFollowers,
  getSuggestPeople
};

export default followControllers;
