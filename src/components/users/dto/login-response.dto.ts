import { Field, ObjectType } from "type-graphql";
import { User } from "../users.model";

@ObjectType()
export class LoginResponseDto {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field((type) => User)
  user: User;
}
