import "reflect-metadata";

import { Field, ObjectType } from "type-graphql";
import { User } from "../users.model";
import { NewTokensResponseDto } from "./new-tokens-response.dto";

@ObjectType()
export class LoginResponseDto extends NewTokensResponseDto {
  @Field((type) => User)
  user: User;
}
