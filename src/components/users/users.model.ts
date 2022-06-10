import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

import { ObjectType, Field, ID, Int } from "type-graphql";

@ObjectType()
@Entity("User")
export class User {
  @Field(() => ID)
  @ObjectIdColumn()
  id: string;

  @Field()
  @Column()
  fullname: string;

  @Field()
  @Column()
  nickname: string;

  @Field()
  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @Field()
  @Column()
  avatar: string;

  @Field((type) => Int, { nullable: true })
  @Column({ nullable: true })
  age: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  gender: string;

  @Column()
  tokenVersion: number;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: string;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: string;
}
