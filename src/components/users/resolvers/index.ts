import { CreateUserMutation } from "./create-user.mutation";
import { ChangePasswordMutation } from "./change-password.mutation";
import { ForgetPasswordMutation } from "./forget-password.mutation";
import { LoginQuery } from "./login.query";
import { LogoutQuery } from "./logout.query";
import { MeQuery } from "./me.query";
import { RefreshTokenQuery } from "./refresh-token.query";
import { UsersQuery } from "./users.query";
import { VerifyRegistrationMutation } from "./verify-registration.mutation";

export const UserResolver = [
  CreateUserMutation,
  ChangePasswordMutation,
  ForgetPasswordMutation,
  LoginQuery,
  LogoutQuery,
  MeQuery,
  RefreshTokenQuery,
  UsersQuery,
  VerifyRegistrationMutation,
];
