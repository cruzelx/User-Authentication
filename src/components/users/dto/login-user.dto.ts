import { IsEmail, Length, Matches } from "class-validator";
import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class LoginUserInputDto {
  @Field()
  @IsEmail()
  email: string;

  @Field({})
  @Length(8, 50)
  password: string;
}
