import "reflect-metadata";

import { ApolloError, UserInputError } from "apollo-server-core";
import { Args, Query, Resolver } from "type-graphql";
import { userRepository } from "../../../config/mongo.datasource";

import { LoginResponseDto } from "../dto/login-response.dto";
import { LoginUserInputDto } from "../dto/login-user.dto";
import { User } from "../users.model";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/token-helper.utils";

@Resolver()
export class LoginQuery {
  @Query(() => LoginResponseDto)
  async login(
    @Args() loginInput: LoginUserInputDto
  ): Promise<LoginResponseDto> {
    try {
      const { email, password } = loginInput;

      const user = await userRepository.findOneBy({ email });
      if (user?.registrationToken)
        throw new ApolloError(
          "User verification is incomplete. Please check your email for verification credentials"
        );
      if (!user)
        throw new UserInputError(
          "Login credentials do not match any records in the system. Please use correct information or register a new account"
        );

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword)
        throw new UserInputError(
          "Incorrect password. Please use correct credentials."
        );

      const commonTokenClaims = {
        sub: user.id,
        iat: Date.now(),
      };

      const accessToken: string = await generateAccessToken({
        ...commonTokenClaims,
        role: user.role,
      });

      const refreshToken: string = generateRefreshToken({
        ...commonTokenClaims,
        tokenVersion: user.refreshTokenVersion,
      });

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }
}
