import "reflect-metadata";

import { AuthenticationError, ForbiddenError } from "apollo-server-core";
import mongoose from "mongoose";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { userRepository } from "../../../config/mongo.datasource";
import { Auth } from "../../../middlewares/auth.middlewares";
import { ICustomContext } from "../../../types/context.interface";
import bcrypt from "bcryptjs";

import { ChangePasswordInputDto } from "../dto/index";

@Resolver()
export class ChangePasswordMutation {
  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async changePassword(
    @Arg("data") changePasswordInput: ChangePasswordInputDto,
    @Ctx() { req, userPayload }: ICustomContext
  ) {
    try {
      const { currentPassword, newPassword } = changePasswordInput;

      let id = new mongoose.Types.ObjectId(userPayload.sub);

      const user = await userRepository.findOneBy({
        _id: id,
      });

      if (!user) throw new ForbiddenError("Unauthorized access is prohibited");

      const isValidCurrentPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isValidCurrentPassword)
        throw new AuthenticationError("Invalid current password");

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await userRepository.updateOne(
        { _id: id },
        { $set: { password: hashedPassword } }
      );
      return true;
    } catch (error) {
      throw error;
    }
  }
}
