import { DataSource } from "typeorm";
import { User } from "../src/components/users/users.model";

export const mongoTestDataSource: DataSource = new DataSource({
  type: "mongodb",
  url: process.env.MONGODB_URI!,
  database: "testuserauthdb",
  logger: "simple-console",
  extra: {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  synchronize: true,
  entities: [User],
});
