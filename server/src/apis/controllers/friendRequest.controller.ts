import { Request,Response } from "express";
import friendRequestService from "../services/friendRequest.service";
import { catchAsync } from "../utils/catch-async";
import { responseSuccess } from "../utils/response";

//@desc Create Friend request
//@route: api/friendRequests
//@access: Private
const createRequest = catchAsync(async(req:Request,res:Response)=>{
  const friendRequest = await friendRequestService.createFriendRequest(req,res)
    return responseSuccess(res,friendRequest)
})
//@desc Close Request
//@route api/friendRequest/:id
const closeRequest = catchAsync(async (req:Request,res:Response)=>{
  const finalResult = await friendRequestService.closeRequest(req,res)
  return responseSuccess(res,finalResult)
})
const friendRequestController = {
  createRequest,closeRequest
}
export default friendRequestController

