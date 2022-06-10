import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { mongoDataSource } from "../../config/mongo.datasource";
import { CreateUserInputDto } from "./dto/create-user.dto";
import { User } from "./users.model";
import bcrypt from "bcrypt";

const userRepository = mongoDataSource.getMongoRepository(User);

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users() {
    try {
      return await userRepository.find();
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async createUser(
    @Arg("data") userInput: CreateUserInputDto
  ): Promise<Boolean> {
    try {
      const { password } = userInput;
      const hashedPassword = await bcrypt.hash(password, 10);
      await userRepository.save(userInput);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
