import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDISDB_URI!,
});

redisClient
  .connect()
  .then((data) => console.log("connected to redis server"))
  .catch((error) => console.log(`Couldtn't connect to redis server`));
