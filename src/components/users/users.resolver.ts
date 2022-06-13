import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Args,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { mongoDataSource } from "../../config/mongo.datasource";
import { CreateUserInputDto } from "./dto/create-user.dto";
import { User } from "./users.model";
import bcrypt from "bcryptjs";
import { generateNickname } from "../../utils/generate-nick-name.utils";
import { generateAvatar } from "../../utils/generate-avatar.utils";
import {
  ApolloError,
  UserInputError,
  AuthenticationError,
  ForbiddenError,
} from "apollo-server-core";
import crypto from "crypto";
import {
  sendChangePasswordToken,
  sendRegistrationToken,
} from "../../utils/mail-service.utils";
import { VerifyRegistrationInputDto } from "./dto/verify-registration.dto";
import { LoginUserInputDto } from "./dto/login-user.dto";
import {
  generateAccessToken,
  generateRefreshToken,
  revokeAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../utils/token-helper.utils";
import { LoginResponseDto } from "./dto/login-response.dto";
import { ICustomContext } from "../../types/context.interface";
import { NewTokensResponseDto } from "./dto/new-tokens-response.dto";
import mongoose from "mongoose";
import { ChangePasswordInputDto } from "./dto/change-password.dto";
import { Auth } from "../../middlewares/auth.middlewares";

const userRepository = mongoDataSource.getMongoRepository(User);

@Resolver()
export class UserResolver {
  @UseMiddleware(Auth)
  @Query(() => User, { nullable: true })
  async me(@Ctx() { userPayload }: ICustomContext) {
    try {
      const id = new mongoose.Types.ObjectId(userPayload.sub);
      return await userRepository.findOneBy({ _id: id });
    } catch (error) {
      throw error;
    }
  }

  @Query(() => [User])
  async users() {
    try {
      return await userRepository.find();
    } catch (error) {
      throw error;
    }
  }

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

      const accessToken: string = await generateAccessToken(commonTokenClaims);

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

  @Query(() => Boolean)
  @UseMiddleware(Auth)
  async logout(
    @Arg("id") userId: string,
    @Ctx() { userPayload }: ICustomContext
  ) {
    try {
      const id = new mongoose.Types.ObjectId(userId);
      await userRepository.updateOne(
        {
          _id: id,
        },
        { $inc: { refreshTokenVersion: 1 } }
      );
      await revokeAccessToken(userPayload.jti);
      return true;
    } catch (error) {
      throw error;
    }
  }

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

      // send registration tokent to email

      sendRegistrationToken(email, registrationToken, registrationId);
      return true;
    } catch (error) {
      throw error;
    }
  }

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
