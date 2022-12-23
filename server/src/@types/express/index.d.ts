import { IUser } from "../user";

declare module "express" {
  export interface Request {
    user: IUser;
    file: any;
    files: any;
    query: any;
  }
}
