import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { mongoDataSource } from "../../config/mongo.datasource";
import { CreateUserInputDto } from "./dto/create-user.dto";
import { User } from "./users.model";
import bcrypt from "bcryptjs";
import { genereateNickname } from "../../utils/generate-nick-name.util";
import { generateAvatar } from "../../utils/generate-avatar.utils";

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
      let { password, avatar, email } = userInput;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const nickname = genereateNickname();

      if (!avatar) {
        avatar = await generateAvatar(email);
      }

      await userRepository.save({
        ...userInput,
        password: hashedPassword,
        nickname,
        avatar,
      });
      return true;
    } catch (error) {
      throw error;
    }
  }
}
