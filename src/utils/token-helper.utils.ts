import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

interface RefreshJWTPayload {
  sub: string;
  tokenVersion: number;
  iss: string;
  aud: string;
  iat: string;
  exp: string;
}

export const generateAccessToken = (payload: object | string): string => {
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET!, {
    algorithm: "HS256",
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: object | string): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET!, {
    algorithm: "HS256",
    expiresIn: "1d",
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!, {
    algorithms: ["HS256"],
    complete: false,
  });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET!, {
    algorithms: ["HS256"],
    complete: false,
  }) as any as RefreshJWTPayload;
};
