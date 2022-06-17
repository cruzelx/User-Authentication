import { AuthChecker } from "type-graphql";
import { ICustomContext } from "../types/context.interface";

export const customAuthChecker: AuthChecker<ICustomContext> = (
  { context },
  roles
) => {
  const userPayload = context.userPayload;

  if (!userPayload?.role) return false;

  if (roles.includes(userPayload?.role)) return true;
  return false;
};
