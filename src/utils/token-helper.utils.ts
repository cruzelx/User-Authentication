import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RedisJWTService } from "../services/redis-jwt.servics";

dotenv.config();

const redisJwtService = new RedisJWTService();

interface JWTPayload {
  sub: string;
  iss: string;
  aud: string;
  iat: string;
  exp: string;
  jti: string;
}

interface RefreshJWTPayload extends JWTPayload {
  tokenVersion: number;
}

interface AccessJWTPayload extends JwtPayload {}

export const generateAccessToken = async (payload: object): Promise<string> => {
  return await redisJwtService.sign(
    { ...payload },
    process.env.JWT_ACCESS_TOKEN_SECRET!,
    {
      algorithm: "HS256",
      audience: process.env.JWT_AUDIENCE,
      issuer: process.env.JWT_ISSUER,
      expiresIn: 15 * 60 * 1000,
    }
  );
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign({ ...payload }, process.env.JWT_REFRESH_TOKEN_SECRET!, {
    algorithm: "HS256",
    expiresIn: 24 * 60 * 60 * 1000,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
  });
};

export const verifyAccessToken = async (
  token: string
): Promise<AccessJWTPayload> => {
  return (await redisJwtService.verify(
    token,
    process.env.JWT_ACCESS_TOKEN_SECRET!,
    {
      algorithms: ["HS256"],
      complete: false,
    }
  )) as any as AccessJWTPayload;
};

export const verifyRefreshToken = (token: string): RefreshJWTPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET!, {
    algorithms: ["HS256"],
    complete: false,
  }) as any as RefreshJWTPayload;
};
