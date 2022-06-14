import { User, UserResolver } from "./users/index";

export const Resolvers = [...UserResolver];
export const Models = { user: User };
