import "reflect-metadata";

import { AuthenticationError, UserInputError } from "apollo-server-core";
import { Arg, Mutation, Resolver } from "type-graphql";
import { userRepository } from "../../../config/mongo.datasource";

import { VerifyRegistrationInputDto } from "../dto/verify-registration.dto";
import { User } from "../users.model";

@Resolver()
export class VerifyRegistrationMutation {
  @Mutation(() => Boolean)
  async verifyRegistration(
    @Arg("data") verificationInput: VerifyRegistrationInputDto
  ): Promise<Boolean> {
    try {
      const { registrationId, registrationToken } = verificationInput;

      const user = await userRepository.findOneBy({ registrationId });

      if (!user) throw new UserInputError("Invalid input from user");

      if (user.registrationToken !== registrationToken)
        throw new AuthenticationError("Unauthorized activity detected");

      userRepository.updateOne(
        { _id: user.id },
        {
          $unset: { registrationId: 1, registrationToken: 1, registeredAt: 1 },
          $set: { registrationVerifiedAt: new Date() },
        }
      );
      return true;
    } catch (error) {
      throw error;
    }
  }
}
