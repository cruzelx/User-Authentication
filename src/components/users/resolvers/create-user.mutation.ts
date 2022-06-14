import { ApolloError, UserInputError } from "apollo-server-core";
import { Arg, Mutation, Resolver } from "type-graphql";
import { userRepository } from "../../../config/mongo.datasource";
import { CreateUserInputDto } from "../dto/create-user.dto";
import bcrypt from "bcryptjs";
import { generateNickname } from "../../../utils/generate-nick-name.utils";
import { generateAvatar } from "../../../utils/generate-avatar.utils";
import crypto from "crypto";
import { sendRegistrationToken } from "../../../utils/mail-service.utils";

@Resolver()
export class CreateUserMutation {
  @Mutation(() => Boolean)
  async createUser(
    @Arg("data") userInput: CreateUserInputDto
  ): Promise<Boolean> {
    try {
      let { password, avatar, email } = userInput;

      const user = await userRepository.findOne({
        where: { email },
      });

      if (user?.registrationToken)
        throw new ApolloError(
          "User has already signed up with this email. Please verify registration using registration token sent to your email."
        );

      if (user)
        throw new UserInputError("User already exists. Try logging in.");

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const nickname = generateNickname();

      if (!avatar) {
        avatar = await generateAvatar(email);
      }
      const registrationToken = crypto.randomBytes(4).toString("hex");
      const registrationId = crypto.randomBytes(4).toString("hex");

      userRepository.save(
        userRepository.create({
          ...userInput,
          password: hashedPassword,
          nickname,
          avatar,
          registrationToken,
          registrationId,
        })
      );

      // send registration token to email

      sendRegistrationToken(email, registrationToken, registrationId);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
