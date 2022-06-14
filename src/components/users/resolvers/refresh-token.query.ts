import { AuthenticationError, ForbiddenError } from "apollo-server-core";
import mongoose from "mongoose";
import { Ctx, Query, Resolver } from "type-graphql";
import { userRepository } from "../../../config/mongo.datasource";

import { ICustomContext } from "../../../types/context.interface";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/token-helper.utils";
import { NewTokensResponseDto } from "../dto/new-tokens-response.dto";
import { User } from "../users.model";

@Resolver()
export class RefreshTokenQuery {
  @Query(() => NewTokensResponseDto)
  async refreshToken(
    @Ctx() { req }: ICustomContext
  ): Promise<NewTokensResponseDto> {
    try {
      const auth = req.headers["x-refresh-token"] as string;
      const token = auth && auth.split(" ")[1];

      if (!token) throw new ForbiddenError("Unauthorized access is prohibited");

      const { sub, tokenVersion } = verifyRefreshToken(token);

      let id = new mongoose.Types.ObjectId(sub);
      const user = await userRepository.findOneBy({
        _id: id,
      });

      if (!user) throw new AuthenticationError("Bad request");

      if (user.refreshTokenVersion !== tokenVersion)
        throw new ForbiddenError("Invalid token provided");

      await userRepository.updateOne(
        { _id: id },
        { $inc: { refreshTokenVersion: 1 } }
      );

      const commonTokenClaims = {
        sub: user?.id,
        iat: Date.now(),
      };
      const refreshToken = generateRefreshToken({
        ...commonTokenClaims,
        tokenVersion: user.refreshTokenVersion + 1,
      });

      const accessToken = await generateAccessToken(commonTokenClaims);
      return {
        refreshToken,
        accessToken,
      };
    } catch (error) {
      throw error;
    }
  }
}
