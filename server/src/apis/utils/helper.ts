import { IUser } from "../../@types/user";

export const formatDateVN = (timestamp: string | number) => {
  return new Date(timestamp).toLocaleDateString();
};

export const randomNumber = () => Math.trunc(Math.random() * 10);

export const genrateTrackingNum = (tracking = "GHNXXXXXXXXVN") => {
  return tracking.replace(/X/g, randomNumber().toString());
};


export const sessionizeUser = (user: Partial<IUser>) => ({
  id: user._id,
  username: user.username,
  fullname: user.fullname,
  email: user.email,
  profilePicture: user.profilePicture,
  isEmailValidated: user.isEmailValidated,
})
