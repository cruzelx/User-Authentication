import { Length, Matches } from "class-validator";
import { ArgsType, Field, InputType } from "type-graphql";

@InputType()
export class ChangePasswordInputDto {
  @Field()
  @Length(8, 50)
  currentPassword: string;

  @Field()
  @Matches(
    new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,50})")
      .source,
    undefined,
    {
      message:
        "Invalid Password Format. Please enter atleast one capital, one small, one numeric and one symbol character. The minimum length of the password is 8",
    }
  )
  @Length(8, 50)
  newPassword: string;
}
