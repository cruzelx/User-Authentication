import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
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

  @Column({ default: 0 })
  tokenVersion: number;

  @Column({ nullable: true })
  registrationToken?: string;

  @Column({ nullable: true })
  registrationId?: string;

  @Index({ expireAfterSeconds: 3600 })
  @Column({ default: new Date(), nullable: true })
  registeredAt?: Date;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: string;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: string;

  @BeforeInsert()
  setDefaults() {
    this.registeredAt = new Date();
  }
}
