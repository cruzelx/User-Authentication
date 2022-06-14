import { DataSource } from "typeorm";
import { Models } from "../components/index";

import dotenv from "dotenv";

dotenv.config();

export const mongoDataSource: DataSource = new DataSource({
  type: "mongodb",
  url: process.env.MONGODB_URI!,
  database: "userauthdb",
  logger: "advanced-console",
  extra: {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  synchronize: true,
  entities: [Models.user],
});

export const userRepository = mongoDataSource.getMongoRepository(Models.user);
