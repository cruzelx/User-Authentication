import "reflect-metadata";

import { Length } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";

@InputType()
export class VerifyRegistrationInputDto {
  @Field()
  @Length(8, 8)
  registrationId: string;

  @Field()
  @Length(8, 8)
  registrationToken: string;
}
