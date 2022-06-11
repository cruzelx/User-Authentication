import { Field, InputType } from "type-graphql";

@InputType()
export class LoginUserInputDto {
  @Field()
  email: string;

  @Field()
  password: string;
}
