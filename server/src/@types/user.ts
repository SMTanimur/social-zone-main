import { Document } from "mongoose";

export enum EGender {
  male = "male",
  female = "female",
  unspecified = "unspecified",
}
export interface IUser extends Document {
  email: string;
    password: string;
    username: string;
    provider_id?: string;
    provider_access_token?: string;
    provider_refresh_token?: string;
    firstname?: string;
    lastname?: string;
    isEmailValidated?: boolean;
    info?: {
        bio?: string;
        birthday?: string | number;
        gender?: EGender
    },
    profilePicture?: string;
    coverPhoto?: string;
    fullname?: string;
    dateJoined: string | Date;
    isFollowing?: boolean;
    isOwnProfile?: boolean;
    toUserJSON(): IUser;
    toProfileJSON(): IUser;
    generateVerificationToken(): string;
    passwordMatch(pw: string, callback: (error: any, match: any) => void): void;
}

export interface IUpdate {
  firstname?: string;
  lastname?: string;
  info?: {
      bio?: string;
      birthday?: string | number;
      gender?: EGender;
  }
}