import mongoose from "mongoose";
import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { userRepository } from "../../../config/mongo.datasource";

import { Auth } from "../../../middlewares/auth.middlewares";
import { ICustomContext } from "../../../types/context.interface";
import { revokeAccessToken } from "../../../utils/token-helper.utils";
import { User } from "../users.model";

@Resolver()
export class LogoutQuery {
  @Query(() => Boolean)
  @UseMiddleware(Auth)
  async logout(
    @Arg("id") userId: string,
    @Ctx() { userPayload }: ICustomContext
  ) {
    try {
      const id = new mongoose.Types.ObjectId(userId);
      await userRepository.updateOne(
        {
          _id: id,
        },
        { $inc: { refreshTokenVersion: 1 } }
      );
      await revokeAccessToken(userPayload.jti);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
