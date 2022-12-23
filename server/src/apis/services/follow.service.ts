import { Request } from "express";
import { Types } from "mongoose";
import { IUser } from "../../@types/user";
import { USERS_LIMIT } from "../constants/limit";
import { STATUS } from "../constants/status";
import Follow from "../models/FollowSchema";
import NewsFeed from "../models/NewsFeedSchema";
import Notification from "../models/NotificationSchema";
import Post from "../models/post";
import User from "../models/user";
import { ApiError } from "../utils/api-error";

const follow = async (req: Request) => {
  try {
    const { follow_id } = req.params;
    const user = await User.findById(follow_id);
    // CHECK IF FOLLOWING USER EXIST
    if (!user) return new ApiError(400, "The person you're trying to follow doesn't exist.");
    // CHECK IF FOLLOWING IS NOT YOURSELF
    if (follow_id === req.user?._id.toString())
      return new ApiError(400, "You can't follow yourself.");

    //  CHECK IF ALREADY FOLLOWING
    const isFollowing = await Follow.findOne({
      user: req.user._id,
      target: follow_id,
    });

    if (isFollowing) {
      return new ApiError(400, "Already following.");
    } else {
      const newFollower = new Follow({
        user: req.user._id,
        target: follow_id,
      });

      await newFollower.save();
    }

    // TODO ---- FILTER OUT DUPLICATES
    const io = req.app.get("io");
    const notification = new Notification({
      type: "follow",
      initiator: req.user._id,
      target: follow_id,
      link: `/${req.user.username}`,
      createdAt: Date.now(),
    });

    await notification.save().then(async (doc) => {
      await doc.populate({
        path: "target initiator",
        select: "fullname profilePicture username",
      });

      io.to(follow_id).emit("newNotification", { notification: doc, count: 1 });
    });

    // SUBSCRIBE TO USER'S FEED
    const subscribeToUserFeed = await Post.find({ _author_id: follow_id })
      .sort({ createdAt: -1 })
      .limit(10);

    if (subscribeToUserFeed.length !== 0) {
      const feeds = subscribeToUserFeed.map((post) => {
        return {
          follower: req.user._id,
          post: post._id,
          post_owner: post._author_id,
          createdAt: post.createdAt,
        };
      });

      await NewsFeed.insertMany(feeds);
    }
    return {
      message: `you are following now ${user?.username}`,
    };
  } catch (err) {
    throw new ApiError(STATUS.BAD_REQUEST, "server error");
  }
};

// unFollow user
const unfollow = async (req: Request) => {
  try {
    const { follow_id } = req.params;

    const user = await User.findById(follow_id);
    if (!user) return new ApiError(400, "The person you're trying to unfollow doesn't exist.");
    if (follow_id === req.user._id.toString())
      return new ApiError(STATUS.FORBIDDEN, "you can not follow or unfollow your own account");

    await Follow.deleteOne({
      target: follow_id,
      user: req.user._id,
    });

    // UNSUBSCRIBE TO PERSON'S FEED
    await NewsFeed.deleteMany({
      post_owner: follow_id,
      follower: req.user._id,
    });

    return {
      message: "Now you are not following him",
    };
  } catch (e) {
    console.log("CANT FOLLOW USER, ", e);
    throw new ApiError(STATUS.BAD_REQUEST, "Server Error");
  }
};

const getFollow = async (
  type = "followers",
  query: Object,
  user: IUser,
  skip: number,
  limit: number,
) => {
  try {
    const myFollowingDoc = await Follow.find({ user: user._id });
    const myFollowing = myFollowingDoc.map((user) => user.target); // map to array of user IDs

    const agg = await Follow.aggregate([
      {
        $match: query,
      },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: type === "following" ? "target" : "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $addFields: {
          isFollowing: { $in: ["$user._id", myFollowing] },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$user._id",
          username: "$user.username",
          firstname: "$user.firstname",
          lastname: "$user.lastname",
          email: "$user.email",
          profilePicture: "$user.profilePicture",
          isFollowing: 1,
        },
      },
    ]);

    // Map out results so we can create the 'fullname' field
    const data = agg.map((info) => {
      const { firstname, lastname, ...rest } = info;
      return {
        ...rest,
        fullname: firstname && lastname ? `${firstname} ${lastname}` : "",
      };
    });

    return data;
  } catch (err) {
    console.log(err);
    throw new ApiError(STATUS.BAD_REQUEST,"SERVER ERROR")
  }
};

// get suggested people 
 const getSuggestPeople = async (req:Request)=>{
  try {
    const offset = parseInt(req.query.offset as string) || 0;
    const skipParam = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || USERS_LIMIT;
    const skip = skipParam || offset * limit;

    const myFollowingDoc = await Follow.find({ user: req.user._id });
    const myFollowing = myFollowingDoc.map(user => user.target);

    const people = await User.aggregate([
        {
            $match: {
                _id: {
                    $nin: [...myFollowing, req.user._id]
                }
            }
        },
        ...(limit < 10 ? ([{ $sample: { size: limit } }]) : []),
        { $skip: skip },
        { $limit: limit },
        {
            $addFields: {
                isFollowing: false,
            }
        },
        {
            $project: {
                _id: 0,
                id: '$_id',
                test: 1,
                username: '$username',
                profilePicture: '$profilePicture',
                // Virtual fields here are inaccessible so we need to include first and last name 
                // to mimic the 'fullname' virtuals
                firstname: '$firstname',
                lastname: '$lastname',
                isFollowing: 1
            }
        }
    ]);

    if (people.length === 0) return new ApiError(404, 'No suggested people.')

    // Map out results so we can create the 'fullname' field
    const data = people.map(info => {
        const { firstname, lastname, ...rest } = info;
        return {
            ...rest,
            fullname: firstname && lastname ? `${firstname} ${lastname}` : ''
        }
    }) 

    return data
} catch (e) {
    console.log('CANT GET SUGGESTED PEOPLE', e);
    
}
 }

const followService = {
  follow,
  unfollow,
  getFollow,
  getSuggestPeople
};
export default followService;
