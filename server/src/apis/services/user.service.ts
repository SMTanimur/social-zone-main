import { STATUS } from "./../constants/status";
import { Request, Response } from "express";
import User from "../models/user";
import { ApiError } from "../utils/api-error";
import Follow from "../models/FollowSchema";
import { IUpdate, IUser } from "../../@types/user";

const getUser = async (req: Request) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username }).select("-password");
  if (!user) throw new ApiError(STATUS.NOT_FOUND, "user not found");
  const myFollowingDoc = await Follow.find({ user: user?._id });
  const myFollowing = myFollowingDoc.map((user) => user.target);
  const [agg] = await User.aggregate([
    {
      $match: { _id: user._id },
    },
    {
      $lookup: {
        // lookup for followers
        from: "follows",
        localField: "_id",
        foreignField: "target",
        as: "followers",
      },
    },
    {
      $lookup: {
        // lookup for following
        from: "follows",
        localField: "_id",
        foreignField: "user",
        as: "following",
      },
    },
    {
      $addFields: {
        isFollowing: { $in: ["$_id", myFollowing] },
        isOwnProfile: {
          $eq: ["$$CURRENT.username", req.user.username],
        },
      },
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        info: 1,
        isEmailValidated: 1,
        email: 1,
        profilePicture: 1,
        coverPhoto: 1,
        username: 1,
        firstname: 1,
        lastname: 1,
        dateJoined: 1,
        followingCount: { $size: "$following" },
        followersCount: { $size: "$followers" },
        isFollowing: 1,
        isOwnProfile: 1,
      },
    },
  ]);

  if (!agg) return new ApiError(404, "User not found.");
  return {
    ...agg,
    fullname: user?.fullname,
  };
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
  try {
    const { username } = req.params;
    const { firstname, lastname, bio, birthday, gender } = req.body;
    const update: IUpdate = { info: {} };
    if (username !== (req.user as IUser).username)
      return new ApiError(STATUS.NOT_FOUND, "User not found");

    if (typeof firstname !== "undefined") update.firstname = firstname;
    if (typeof lastname !== "undefined") update.lastname = lastname;
    if (bio) update.info!.bio = bio;
    if (birthday) update.info!.birthday = birthday;
    if (gender) update.info!.gender = gender;

    const newUser = await User.findOneAndUpdate(
      { username },
      {
        $set: update,
      },
      {
        new: true,
      },
    );

    return {
      message: "successfully updated your profile",
      user: newUser?.toUserJSON(),
    };
  } catch (e) {
    console.log(e);
    throw new ApiError(STATUS.BAD_REQUEST, "Server Error");
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

const userService = {
  getUser,
  getUserInfo,
  updateMe,
  deleteAccount,
};

export default userService;
