import jwt from "jsonwebtoken";
import { createClient } from "redis";

export const redisClient = createClient();
