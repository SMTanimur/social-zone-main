import { Router } from "express";
import friendRequestController from "../controllers/friendRequest.controller";



const friendRequestRoute = Router()

 friendRequestRoute.post("/",friendRequestController.createRequest)

export default friendRequestRoute