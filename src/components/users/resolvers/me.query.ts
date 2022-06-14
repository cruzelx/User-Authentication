import mongoose from "mongoose";
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { userRepository } from "../../../config/mongo.datasource";

import { Auth } from "../../../middlewares/auth.middlewares";
import { ICustomContext } from "../../../types/context.interface";
import { User } from "../users.model";

@Resolver()
export class MeQuery {
  @UseMiddleware(Auth)
  @Query(() => User, { nullable: true })
  async me(@Ctx() { userPayload }: ICustomContext) {
    try {
      const id = new mongoose.Types.ObjectId(userPayload.sub);
      return await userRepository.findOneBy({ _id: id });
    } catch (error) {
      throw error;
    }
  }
}
