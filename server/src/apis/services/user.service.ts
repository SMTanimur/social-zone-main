import { STATUS } from "./../constants/status";
import { Request, Response } from "express";
import User from "../models/user";
import { ApiError } from "../utils/api-error";

const getUser = async (req: Request) => {
  const { username } = req.params;
  console.log(username)
  const user = await User.findOne({ username: username }).select("-password");
  if (!user) throw new ApiError(STATUS.NOT_FOUND, "user not found");
  // @ts-ignore
  return user._doc;
};

const getUserInfo = async (res: Response) => {
  const user = await User.findById(res.locals.user.id)
    // .populate("friends", "username profilePicture")
    // .populate("friendRequests", "from to createdAt")
    // .populate("messageNotifications", "createdAt from to conversation")
    // .populate("postNotifications", "post createdAt user type")
    .select("-password");
  // let fullUser = await User.populate(user, {
  //   path: "friendRequests.from",
  //   select: "username profilePicture",
  // });
  // fullUser = await User.populate(user, {
  //   path: "friendRequests.to",
  //   select: "username profilePicture",
  // });
  // fullUser = await User.populate(user, {
  //   path: "messageNotifications.from",
  //   select: "username profilePicture",
  // });
  // fullUser = await User.populate(user, {
  //   path: "postNotifications.user",
  //   select: "profilePicture username",
  // });

  const response = {
    //@ts-ignore
    data: user?._doc,
  };
  return response;
};

const updateMe = async (req: Request) => {
  const id = req.params.id;
  try {
    const userUpdate = await User.findByIdAndUpdate({ _id: id }, req.body, { new: true })
      .select({ password: 0 })
      .lean();
    if (!userUpdate) throw new ApiError(STATUS.NOT_FOUND, "User not found");
    const response = { message: " user successfully updated", data: userUpdate };
    return response;
  } catch (error) {
    throw new ApiError(STATUS.INTERNAL_SERVER_ERROR, "this is Server Error");
  }
};

//@desc Account delete
//@route /api/user/:id
//access Private
const deleteAccount = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(STATUS.NOT_FOUND, "user not found");
  if (user?._id != res.locals.user.id) {
    await User.findByIdAndDelete(user._id);
    return {
      message: "Account has been deleted",
    };
  } else {
    throw new ApiError(STATUS.UNAUTHORIZED, "You can only delete your account");
  }
};

// get Friends
const getFriend = async (req: Request) => {
  const user = await User.findById(req.params.id).populate("friends", "username profilePicture");
  if (!user) {
    throw new ApiError(STATUS.NOT_FOUND, "user not found");
  } else {
    return {
      status: STATUS.OK,
      friends: user.friends,
    };
  }
};

const searchUsers = async (req: Request, res: Response) => {
  const { search } = req.query;
  const username = new RegExp(search as string, "i");
  const users = await User.find({
    username,
  }).find({ _id: { $ne: res.locals.user.id } });
  return users;
};

const removeFriend = async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUserId = res.locals.user.id;
  const user = await User.findByIdAndUpdate(
    currentUserId,
    {
      $pull: {
        friends: id,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
  await User.findByIdAndUpdate(
    id,
    {
      $pull: {
        friends: currentUserId,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return {
    message: "successfully remove friend",
    user,
  };
};
const userService = {
  getUser,
  getUserInfo,
  updateMe,
  deleteAccount,
  getFriend,
  searchUsers,
  removeFriend,
};

export default userService;
