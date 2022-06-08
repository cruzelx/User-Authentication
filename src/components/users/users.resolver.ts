import { mongoDataSource } from "../../config/mongo.datasource";
import { User } from "./users.model";

const userRepository = mongoDataSource.getMongoRepository(User);

export const userResolver = {
  Query: {
    users: async (): Promise<User[]> => {
      try {
        return await userRepository.find();
      } catch (error) {
        throw error;
      }
    },
  },
};
