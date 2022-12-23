import { UploadApiResponse } from "cloudinary";
import { Request } from "express";
import { IUser } from "../../@types/user";
import { STATUS } from "../constants/status";
import User from "../models/user";
import { ApiError } from "../utils/api-error";
import { uploadImageToStorage } from "../utils/cloudinary";

const uploadPic = async (req:Request) => {
  const { field } = req.params;
  const file = req.file;
  if (!file) return new ApiError(STATUS.NOT_FOUND, "This file not found");
  if (!["picture", "cover"].includes(field))
    return new ApiError(STATUS.NOT_ACCEPTABLE, `Unexpected field ${field}`);
    const image = await uploadImageToStorage(file, `${req.user?.username}/profile`)
            const fieldToUpdate = field === 'picture' ? 'profilePicture' : 'coverPhoto';

            const url = (image as UploadApiResponse).url
            await User.findByIdAndUpdate((req.user as IUser)._id, {
                $set: {
                    [fieldToUpdate]: url
                }
            });

        return {
          message:'successfully upload image',
          data:url
        }
};

const uploadService = {
  uploadPic,
};
export default uploadService;
