import "reflect-metadata";

import { AuthenticationError } from "apollo-server-core";
import { Arg, Mutation, Resolver } from "type-graphql";
import { sendChangePasswordToken } from "../../../utils/mail-service.utils";
import jwt from "jsonwebtoken";
import { userRepository } from "../../../config/mongo.datasource";

@Resolver()
export class ForgetPasswordMutation {
  @Mutation(() => Boolean)
  async forgetPassword(@Arg("email") email: string) {
    try {
      const { JWT_RESET_PASSWORD_SECRET, SERVER_HOST, SERVER_PORT } =
        process.env;
      const user = await userRepository.findOneBy({ email });
      if (!user)
        throw new AuthenticationError("User doesn't exist. Please register.");

      const secret: string = JWT_RESET_PASSWORD_SECRET! + user.password;

      const token = jwt.sign({ sub: user.id }, secret, {
        algorithm: "HS256",
        expiresIn: 15 * 60 * 1000,
        issuer: `${SERVER_HOST}:${SERVER_PORT}`,
      });

      const resetUrl = `http://localhost:${SERVER_PORT}/reset-password/${user.id}/${token}`;

      sendChangePasswordToken(email, resetUrl);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
