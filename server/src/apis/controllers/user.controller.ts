import { Request, Response } from "express";
import User from "../models/user";
import userService from "../services/user.service";
import { catchAsync } from "../utils/catch-async";
import { responseSuccess } from "../utils/response";



//@desc  Get UserInfo
//@route /user/me
//@access  Private

const getUserInfo = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserInfo(res);
  return responseSuccess(res, user);
});
//@desc  update User profile
//@route /username/edit
//@access  Private
const updateMe = catchAsync(async (req: Request, res: Response) => {
  const updateUserData = await userService.updateMe(req);
  return responseSuccess(res, updateUserData);
});

//@desc delete user
//@route /user/:id
//@access Private

const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  const response = await userService.deleteAccount(req, res);
  return responseSuccess(res, response);
});



/**
 * @desc getUser
 * @route GET /api/username
 * @access Private
 */
const GetUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUser(req);
  return responseSuccess(res, user);
});



const userController = {
  GetUser,
  getUserInfo,
  updateMe,
  deleteAccount
};


export default userController;
