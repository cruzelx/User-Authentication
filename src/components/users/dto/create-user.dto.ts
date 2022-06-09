import { Field, InputType } from "type-graphql";
import { IsEmail, IsEnum, IsUrl, Length } from "class-validator";

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
