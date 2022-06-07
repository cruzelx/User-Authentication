import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.entity";

const userSchema: Schema = new Schema<IUser>(
  {
    fullname: { type: String, required: true },
    nickname: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, required: true },
    age: Number,
    gender: String,
    tokenVersion: Number,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
