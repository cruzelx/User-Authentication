import { DataSource } from "typeorm";
import { User } from "../components/users/users.model";

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
  entities: [User],
});
