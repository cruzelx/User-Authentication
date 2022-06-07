import { Document } from "mongoose";

enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}
interface User {
  id?: string;
  fullname: string;
  nickname: string;
  email: string;
  avatar: string;
  age?: number;
  gender?: Gender;
  tokenVersion?: number;
}

export type IUser = User & Document;
