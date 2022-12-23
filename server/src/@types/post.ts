import { Document } from "mongoose";
import { IComment } from "../apis/models/CommentSchema";
import { EPrivacy } from "../apis/models/post";
import { IUser } from "./user";

export interface IPost extends Document {
  _author_id: IUser['_id'];
  privacy: EPrivacy;
  photos?: Record<string, any>[];
  description: string;
  likes: Array<IUser['_id']>;
  comments: Array<IComment['_id']>;
  isEdited: boolean;
  createdAt: string | number;
  updatedAt: string | number;

  author: IUser;

  isPostLiked(id: string): boolean;
}

export interface IUpdatePost {
  description?: string;
  privacy?: EPrivacy;
  updatedAt: number;
  isEdited: boolean;
}