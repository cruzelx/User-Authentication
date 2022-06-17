import { ForbiddenError } from "apollo-server-core";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { mongoDataSource, userRepository } from "../config/mongo.datasource";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

export const verifyResetPasswordUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, token } = req.params;
    const { JWT_RESET_PASSWORD_SECRET, SERVER_HOST, SERVER_PORT } = process.env;

    console.log("inside reset verification");
    const userId = new mongoose.Types.ObjectId(id);

    const user = await userRepository.findOneBy({ _id: userId });

    if (!user) throw new ForbiddenError("Reset link has been tampered");

    const secret: string = JWT_RESET_PASSWORD_SECRET! + user.password;

    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
      issuer: `${SERVER_HOST}:${SERVER_PORT}`,
    });
    console.log(decoded);
    res.status(200).json({ msg: "ok" });
  } catch (error) {
    if (error instanceof JsonWebTokenError)
      res.status(400).json({ msg: "invalid link" });
    else throw error;
  }
};
