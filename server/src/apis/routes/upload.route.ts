import { Router } from "express";
import uploadController from "../controllers/upload.controllers";
import { multer } from "../utils/cloudinary";

const uploadRoute = Router()

uploadRoute.post("/:field",multer.single('photo'), uploadController.uploadNewPicture)

export default uploadRoute