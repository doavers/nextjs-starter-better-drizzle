import { JWTPayload } from "jose";

import { UserRole } from "@/config/role-config";
import { getUserByEmail } from "@/server/users";
import UserType from "@/types/common/user-type";

import { rejectApiResponse } from "./reject-response";

export const isAllowedRole = (userRole: string, allowedRoles: UserRole[] | string[]) => {
  if ((allowedRoles as string[]).indexOf(userRole) >= 0) {
    return true;
  }
  return false;
};

export const isBannedUser = (banned: boolean | null, banExpires: Date | null) => {
  if (banned) {
    if (banExpires && banExpires > new Date()) {
      return true;
    }
  }
  return false;
};

export const accessRoleValidation = async ({
  userRole,
  allowedRoles,
  traceId,
  method,
  contextName,
  startTime,
  jwtData,
}: {
  userRole: string;
  allowedRoles: UserRole[] | string[];
  traceId: string;
  method: string;
  contextName: string;
  startTime: number;
  jwtData: JWTPayload;
}) => {
  const isAllowedRoles = isAllowedRole(userRole, allowedRoles);
  if (!isAllowedRoles) {
    const responseTime = Date.now() - startTime;
    return rejectApiResponse({ traceId, responseHttp: 403, method, contextName, responseTime });
  }

  const existingUser = await getUserByEmail((jwtData as UserType).email);
  if (!existingUser || existingUser.role !== (jwtData as UserType).role) {
    const responseTime = Date.now() - startTime;
    return rejectApiResponse({
      traceId,
      responseHttp: 400,
      method,
      contextName,
      responseTime,
      customMessage: "Invalid user.",
    });
  }
  const isBanned = isBannedUser(existingUser.banned, existingUser.banExpires);
  if (isBanned) {
    const responseTime = Date.now() - startTime;
    return rejectApiResponse({
      traceId,
      responseHttp: 403,
      method,
      contextName,
      responseTime,
      customMessage: "User is banned.",
    });
  }

  return null;
};
