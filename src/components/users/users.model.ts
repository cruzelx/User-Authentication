import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
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
  @Column()
  email: string;

  @Field()
  @Column()
  avatar: string;

  @Field()
  @Column({ nullable: true })
  age: number;

  @Field()
  @Column({ nullable: true })
  gender: string;

  @Field()
  @Column()
  tokenVersion: number;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: string;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: string;
}
