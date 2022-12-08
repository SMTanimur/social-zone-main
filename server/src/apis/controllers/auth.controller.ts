import { Request,Response } from "express";
import authServices from "../services/auth.service";
import { catchAsync } from "../utils/catch-async";
import { responseSuccess } from "../utils/response";

//@desc   User Register
//@route    POST /api/auth/sign-up
//@access  Public
const SignUp = catchAsync(async(req:Request,res:Response)=>{
  const newUser = await authServices.signUp(req)
   return responseSuccess(res,newUser)
})


//@desc  Login User
//@route  POST /api/auth/sign-in
//access  Private

const signIN = catchAsync(async(req:Request,res:Response)=>{
  const user = await authServices.signIn(req,res)
  return responseSuccess(res,user)
})


//@desc  User Logout
//@route  GET /api/auth/logout
//access  Private
const logOut = catchAsync(async(req:Request,res:Response)=>{
   const logOutUser =  authServices.logOut(res)
    return responseSuccess(res,logOutUser)
})


const authControllers = {
  SignUp,
  signIN,
  logOut
}

export default authControllers