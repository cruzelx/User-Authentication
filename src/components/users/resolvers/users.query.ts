import { Query, Resolver } from "type-graphql";
import { userRepository } from "../../../config/mongo.datasource";

import { User } from "../users.model";

@Resolver()
export class UsersQuery {
  @Query(() => [User])
  async users() {
    try {
      return await userRepository.find();
    } catch (error) {
      throw error;
    }
  }
}
