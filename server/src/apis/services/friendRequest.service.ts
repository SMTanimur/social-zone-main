import { STATUS } from "./../constants/status";
import { Request, Response } from "express";
import FriendRequest from "../models/friendRequest";
import User from "../models/user";
import { ApiError } from "../utils/api-error";

const createFriendRequest = async (req: Request, res: Response) => {
  const { to } = req.body;
  const newFriendRequest = await FriendRequest.create({
    from: res.locals.user.id,
    to: to,
  });
  await User.findByIdAndUpdate(to, {
    $push: {
      friendRequests: newFriendRequest,
    },
  });
  await User.findByIdAndUpdate(res.locals.user.id, {
    $push: {
      friendRequests: newFriendRequest,
    },
  });
  const friendRequest = await FriendRequest.findById(newFriendRequest)
    .populate("from", "username profilePicture")
    .populate("to", "username profilePicture");

  if (!friendRequest) throw new ApiError(STATUS.NOT_FOUND, "user not found");
  const response = {
    message: "Friend request successfully sent",
    data: friendRequest,
  };
  return response;
};

// Friend Request toggle
  
const closeRequest = async(req:Request,res:Response)=>{
  const {id:requestId}= req.params
   const {status} = req.body
}

const friendRequestService = {
  createFriendRequest,
  closeRequest
};

export default friendRequestService;
