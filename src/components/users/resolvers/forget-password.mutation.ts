import { AuthenticationError } from "apollo-server-core";
import { Arg, Mutation, Resolver } from "type-graphql";
import { userRepository } from "../../../config/mongo.datasource";
import { User } from "../users.model";
import crypto from "crypto";
import { sendChangePasswordToken } from "../../../utils/mail-service.utils";

@Resolver()
export class ForgetPasswordMutation {
  @Mutation(() => Boolean)
  async forgetPassword(@Arg("email") email: string) {
    try {
      const user = await userRepository.findOneBy({ email });
      if (!user)
        throw new AuthenticationError("User doesn't exist. Please register.");
      const token = crypto.randomBytes(8).toString("hex");
      const id = crypto.randomBytes(8).toString("hex");

      await userRepository.updateOne(
        { email },
        { $set: { changePasswordId: id, changePasswordToken: token } }
      );

      sendChangePasswordToken(email, token, id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
