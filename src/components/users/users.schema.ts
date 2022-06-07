import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";

export const userSchema: DocumentNode = gql`
  type User {
    id: ID!
    fullname: String!
    nickname: String!
    email: String!
    avatar: String!
    age: String
    gender: String
    tokenVersion: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    users: [User!]!
  }
`;
