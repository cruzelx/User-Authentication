import { createClient } from "redis";

export const redisClient = createClient();
redisClient
  .connect()
  .then((data) => console.log("connected to redis server"))
  .catch((error) => console.log(`Coultn't connect to redis server`));
