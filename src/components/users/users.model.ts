import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
} from "typeorm";
import "reflect-metadata";

import { ObjectType, Field, ID, Int, Authorized } from "type-graphql";

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

  @Authorized("ADMIN")
  @Field()
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

  @Field({ nullable: true })
  @Column({ nullable: true })
  role?: string;

  @Authorized("ADMIN")
  @Field()
  @Column({ default: 0 })
  refreshTokenVersion: number;

  @Column({ nullable: true })
  registrationToken?: string;

  @Column({ nullable: true })
  registrationId?: string;

  @Index({ expireAfterSeconds: 3600 })
  @Column({ default: new Date(), nullable: true })
  registeredAt?: Date;

  @Column({ nullable: true })
  registrationVerifiedAt?: Date;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: string;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: string;

  @BeforeInsert()
  setDefaults() {
    this.registeredAt = new Date();
    this.refreshTokenVersion = 0;
  }
}
