import { NextFunction, Request, Response } from "express";
import passport from "passport";
import env from "../../configs/env";
import { STATUS } from "../constants/status";
import authServices from "../services/auth.service";
import { ApiError } from "../utils/api-error";
import { catchAsync } from "../utils/catch-async";
import { sessionizeUser } from "../utils/helper";
import { responseSuccess } from "../utils/response";

//@desc   User Register
//@route    POST /api/auth/sign-up
//@access  Public
const SignUp = catchAsync(async (req: Request, res: Response) => {
  const newUser = await authServices.signUp(req);
  return responseSuccess(res, newUser);
});

//@desc  Login User
//@route  POST /api/auth/sign-in
//access  Private

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", function (err, user, info) {
    if (!user)
      //! ask stack overflow question this throw new Error("message")
      return res.status(401).json({ message: "username or password is not correct" });

    req.login(user, (err) => {
      if (err) throw err;
      const userData = sessionizeUser(user);
      responseSuccess(res,userData)
    });
  })(req, res, next);
});

//@desc check-session
//@route  GET /api/auth/check-session
//access Private
const checkSession = catchAsync(async (req: Request, res: Response) => {
  const user = sessionizeUser(req.user!);
  if (!user) throw new ApiError(STATUS.UNAUTHORIZED, "user unauthorized");
  responseSuccess(res, user);
});
//@desc  User Logout
//@route  GET /api/auth/logout
//access  Private
const logOut = catchAsync(async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    // delete session data from store, using sessionID in cookie
    if (err) throw err;
    res.clearCookie(env.passport.sessionName || "szone_sid"); // clears cookie containing expired sessionID
    res.send("Logged out successfully");
  });
});
const authControllers = {
  SignUp,
  login,
  checkSession,
  logOut,
};

export default authControllers;
