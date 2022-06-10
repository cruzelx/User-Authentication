import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { mongoDataSource } from "../../config/mongo.datasource";
import { CreateUserInputDto } from "./dto/create-user.dto";
import { User } from "./users.model";
import bcrypt from "bcryptjs";
import { genereateNickname } from "../../utils/generate-nick-name.util";
import { generateAvatar } from "../../utils/generate-avatar.utils";
import { UserInputError } from "apollo-server-core";
import crypto from "crypto";
import { sendRegistrationToken } from "../../utils/mail-service.utils";

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

      const user = await userRepository.findOne({
        where: { email },
      });

      if (user)
        throw new UserInputError("User already exists. Try logging in.");

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const nickname = genereateNickname();

      if (!avatar) {
        avatar = await generateAvatar(email);
      }

      userRepository.save({
        ...userInput,
        password: hashedPassword,
        nickname,
        avatar,
      });

      // send registration tokent to email
      const randomToken = crypto.randomBytes(4).toString("hex");

      sendRegistrationToken(email, randomToken);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
