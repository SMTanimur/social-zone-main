import { Request, Response } from "express"
import uploadService from "../services/upload.service"
import { catchAsync } from "../utils/catch-async"
import { responseSuccess } from "../utils/response"


/**
 * @desc Upload Profile picture or coverPhoto 
 * @route POST  /api/upload/:field
 * @access Private
 */


const uploadNewPicture = catchAsync(async(req:Request,res:Response)=>{
  const response = await uploadService.uploadPic(req)
  return responseSuccess(res,response)
})

const uploadController ={
  uploadNewPicture
}
export default uploadController