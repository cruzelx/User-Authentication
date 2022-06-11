import { IsEmail, Length } from "class-validator";
import { ArgsType, Field, InputType } from "type-graphql";

@ArgsType()
export class LoginUserInputDto {
  @Field()
  @IsEmail()
  email: string;

  @Field({})
  @Length(8, 50)
  password: string;
}
