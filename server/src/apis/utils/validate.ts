import { Request } from "express";
import mongoose from "mongoose";

const REGEX_EMAIL = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;
export const isEmail = (email: string) => {
  return REGEX_EMAIL.test(email);
};

export const isAdmin = (req: Request) => {
  return req.user?.isAdmin;
};

export const isMongoId = (id: string) => mongoose.Types.ObjectId.isValid(id);
