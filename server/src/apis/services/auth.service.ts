import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../../configs/env";
import { STATUS } from "../constants/status";
import cookie from "cookie";
import User from "../models/user";
import { ApiError } from "../utils/api-error";
import { createHash } from "../utils/hash";

const signUp = async (req: Request) => {
  const { email, username } = req.body;
  const userInDB = await User.findOne({ email }).exec();
  if (!userInDB) {
    const hashed = await createHash(req.body.password);
    const newUser = new User({ email, username, password: hashed });
    const savedUser = (await newUser.save()).toObject();
    const { password, ...user } = savedUser;
    const response = { message: "User Register successfully", data: user, status:STATUS.CREATED};
    return response;
  } else {
    throw new ApiError(STATUS.NOT_ACCEPTABLE, "Email already exit!");
  }
};
const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();
  if (!user) throw new ApiError(STATUS.NOT_ACCEPTABLE, "User not found!");
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new ApiError(STATUS.NOT_ACCEPTABLE, "password incorrect!");
  if (user && validPassword) {
    const token = jwt.sign({ id: user._id }, env.passport.jwtSecretKey as string, {
      expiresIn: env.passport.expiredAccessToken,
    });

    res.set(
      "Set-Cookie",
      cookie.serialize("green_sid", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 3600 * 24 * 7,
        path: "/",
      }),
    );
    const { password, ...others } = user;
    const response = {
      message: `${others.username} successfully login!`,
      data: { ...others, token },
    };
    return response;
  }
};

const logOut = async (res: Response) => {
  res.set(
    "Set-Cookie",
    cookie.serialize("green_sid", "", {
      httpOnly: true,
      secure: true,
      maxAge: +new Date(0),
      sameSite: "none",
      path: "/",
    }),
  );

  const response = { message: "User successfully logout!" };
  return response;
};

const authServices = {
  signUp,
  signIn,
  logOut,
};
export default authServices;
