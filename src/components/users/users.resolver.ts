import { IUser } from "./user.entity";
import { User } from "./users.model";

export const userResolver = {
  Query: {
    users: async (): Promise<IUser[]> => {
      try {
        console.log("inside resolver");
        const users = await User.find();
        console.log("inside resolver");
        console.log(users);
        return users;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
