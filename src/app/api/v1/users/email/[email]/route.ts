import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

import { UserRole } from "@/config/role-config";
import { rejectApiResponse } from "@/lib/api/reject-response";
import { accessRoleValidation } from "@/lib/api/role-validation";
import { validateToken } from "@/lib/jwt";
import logger from "@/lib/logger";
import { getUserByEmail } from "@/server/users";
import { APIResponse } from "@/types/api/api-response";
import UserType from "@/types/common/user-type";

export async function GET(request: Request, { params }: { params: Promise<{ email: string }> }) {
  const traceId = uuidv4();
  const method = "GET";
  const contextName = "api/v1/users/email/[email]";
  const startTime = Date.now();
  // Get token from headers
  const headersList = await headers();
  const authorization = headersList.get("authorization");
  const accessToken = authorization?.replace("Bearer ", "");
  const { email } = await params;
  const body = null;

  logger.info(`${method} ${contextName}`, {
    additionalInfo: {
      traceId,
      type: "REQUEST",
      reqData: {
        method,
        epUrl: `api/v1/users/email/${email}`,
        headers,
        body,
      },
    },
  });

  if (!accessToken) {
    const responseTime = Date.now() - startTime;
    return rejectApiResponse({
      traceId,
      responseHttp: 401,
      method,
      contextName,
      responseTime,
      customMessage: "Missing or invalid token.",
    });
  }

  try {
    const jwtData = await validateToken({ type: "access_token", token: accessToken });
    const jwtUser = jwtData;

    // START ACCESS AND ROLE VALIDATION
    const rejectAccess = await accessRoleValidation({
      userRole: (jwtUser as UserType).role,
      allowedRoles: [UserRole.SUPERADMIN as string],
      traceId,
      method,
      contextName,
      startTime,
      jwtData: jwtData,
    });

    if (rejectAccess) {
      return rejectAccess;
    }
    // END ACCESS AND ROLE VALIDATION

    const user = await getUserByEmail(email);

    const responseHttp = 200;
    const responseTime = Date.now() - startTime;
    const apiResponse = {
      traceId,
      code: "00",
      message: `GET /api/v1/users/email/[email] success`,
      data: user,
    } as APIResponse;

    logger.info(`${method} ${contextName}`, {
      additionalInfo: {
        traceId,
        type: "RESPONSE",
        responseTime,
        resData: {
          method,
          epUrl: contextName,
          headers: { responseHttp },
          body: apiResponse,
        },
      },
    });

    return Response.json(apiResponse, {
      status: responseHttp,
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return rejectApiResponse({
      traceId,
      responseHttp: 401,
      method,
      contextName,
      responseTime,
      customMessage: "Invalid or expired token",
      error,
    });
  }
}
