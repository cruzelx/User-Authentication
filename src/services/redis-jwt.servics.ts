import jwt, {
  SignOptions,
  Secret,
  VerifyOptions,
  JsonWebTokenError,
  JwtPayload,
} from "jsonwebtoken";
import { redisClient } from "../config/redis.db";
import crypto from "crypto";

export class RedisJWTService {
  private readonly redis = redisClient;
  private readonly prefix = "jwt_token_ID:";

  public sign = async <T extends object & { jti?: string }>(
    payload: T,
    secret: string,
    options: SignOptions
  ): Promise<string> => {
    const jti: string = payload.jti || crypto.randomUUID();
    const token: string = jwt.sign({ ...payload, jti }, secret, options);
    const redisKey: string = this.prefix + jti;
    const decoded = jwt.decode(token, {
      json: true,
    });

    if (decoded?.exp) {
      const duration = Math.floor((decoded.exp - Date.now()) / 1000.0);

      if (duration > 0) {
        // this.redis.SETEX(keyPrefix, duration, jti);
        this.redis.setEx(redisKey, duration, "true");
      }
    } else {
      this.redis.set(redisKey, "true");
    }
    return token;
  };

  public verify = async (
    token: string,
    secret: Secret,
    options: VerifyOptions
  ): Promise<JwtPayload> => {
    try {
      const verifiedToken = jwt.verify(token, secret, options) as JwtPayload;

      if (!verifiedToken.jti)
        throw new JsonWebTokenError("Invalid token provided");

      const redisKey = this.prefix + verifiedToken.jti;

      const result = await this.redis.get(redisKey);
      if (!result) throw new JsonWebTokenError("Token doesn't exist");
      return verifiedToken;
    } catch (error) {
      throw error;
    }
  };

  public revoke = async (jti: string): Promise<Boolean> => {
    try {
      const redisKey = this.prefix + jti;

      const numberOfKeysDeleted = await this.redis.del(redisKey);
      return numberOfKeysDeleted > 0;
    } catch (error) {
      throw error;
    }
  };
}
