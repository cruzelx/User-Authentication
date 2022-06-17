import { UserInputError, ForbiddenError } from "apollo-server-core";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

import { userRepository } from "../config/mongo.datasource";
import bcrypt from "bcryptjs";

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, token } = req.params;
    const { password, confirmPassword } = req.body;
    const { JWT_RESET_PASSWORD_SECRET, SERVER_HOST, SERVER_PORT } = process.env;

    if (password !== confirmPassword)
      throw new UserInputError("Password doesn't match with confirm password");

    const userId = new mongoose.Types.ObjectId(id);

    const user = await userRepository.findOneBy({
      _id: userId,
    });

    if (!user) throw new ForbiddenError("User doesn't exist");

    const secret: string = JWT_RESET_PASSWORD_SECRET + user.password;

    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
      issuer: `${SERVER_HOST}:${SERVER_PORT}`,
    });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    await userRepository.updateOne(
      {
        _id: userId,
      },
      {
        $set: { password: hashedPassword },
      }
    );
    res.status(201).json({ msg: "Password reset successfully" });
  } catch (error) {
    if (error instanceof JsonWebTokenError)
      res.status(400).json({ msg: "invalid link" });
    else throw error;
  }
};
