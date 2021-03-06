import "reflect-metadata";

import { Authorized, Query, Resolver } from "type-graphql";
import { userRepository } from "../../../config/mongo.datasource";

import { User } from "../users.model";

@Resolver()
export class UsersQuery {
  @Authorized("ADMIN")
  @Query(() => [User], { defaultValue: [] })
  async users() {
    try {
      return await userRepository.find();
    } catch (error) {
      throw error;
    }
  }
}
