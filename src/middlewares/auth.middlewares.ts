import { ForbiddenError } from "apollo-server-core";
import { MiddlewareFn, ResolverData } from "type-graphql";
import { ICustomContext } from "../types/context.interface";
import { verifyAccessToken } from "../utils/token-helper.utils";

export const Auth: MiddlewareFn<ICustomContext> = async (
  { context, info },
  next
) => {
  const auth = context.req.headers.authorization;
  const token = auth && auth.split(" ")[1];
  if (!token) throw new ForbiddenError("Unauthorized access is forbidden");
  const verifiedData = await verifyAccessToken(token);
  context.userPayload = verifiedData;
  return next();
};
