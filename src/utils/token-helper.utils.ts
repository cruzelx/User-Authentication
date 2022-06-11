import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

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
  });
};
