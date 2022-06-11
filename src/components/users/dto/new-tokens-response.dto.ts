import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class NewTokensResponseDto {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
