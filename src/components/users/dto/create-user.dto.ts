import { Field, InputType } from "type-graphql";
import { IsEmail, IsEnum, IsUrl, Length, Matches } from "class-validator";

enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

@InputType()
export class CreateUserInputDto {
  @Field()
  @Length(6, 50)
  fullname: string;

  @Field()
  @Matches("^/(?=.*d)(?=.*W+)(?=.*[a-z])(?=.*[A-Z]).{8,}/$", undefined, {
    message:
      "Invalid Password Format. Please enter atleast one capital, one small, one numeric and one symbol character. The minimum length of the password is 8",
  })
  password: string;

  @Field()
  @Length(6, 32)
  nickname: string;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsUrl()
  avatar: string;

  @Field({ nullable: true })
  @IsEnum(Gender)
  gender: string;
}
