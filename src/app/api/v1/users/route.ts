import { JWTPayload } from "jose";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { UserRole } from "@/config/role-config";
import { rejectApiResponse } from "@/lib/api/reject-response";
import { accessRoleValidation } from "@/lib/api/role-validation";
import { validateToken } from "@/lib/jwt";
import logger from "@/lib/logger";
import { getUserByEmail, getUsers, signUp } from "@/server/users";
import { APIPagingResponse, APIResponse } from "@/types/api/api-response";
import UserType from "@/types/common/user-type";

export async function GET(request: NextRequest) {
  const traceId = uuidv4();
  const method = "GET";
  const contextName = "api/v1/users";
  const body = null;
  const startTime = Date.now();
  // Get token from headers
  const headersList = await headers();
  const authorization = headersList.get("authorization");
  const accessToken = authorization?.replace("Bearer ", "");

  // Get query parameters for pagination and filtering
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search");
  const role = searchParams.get("role");

  logger.info(`${method} ${contextName}`, {
    additionalInfo: {
      traceId,
      type: "REQUEST",
      reqData: {
        method,
        epUrl: contextName,
        headers: headersList,
        body,
        queryParams: { page, limit, search, role },
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
    const currentUser = jwtData as UserType;

    // All authenticated users can access this endpoint, but data will be filtered by role
    const allUsers = await getUsers(page, limit, search || undefined, role || undefined, currentUser);

    const responseHttp = 200;
    const responseTime = Date.now() - startTime;
    const apiResponse = {
      traceId,
      code: "00",
      message: "Get users success",
      data: allUsers,
    } as APIPagingResponse;

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
      customMessage: "Invalid or expired token.",
      error,
    });
  }
}

export async function POST(request: Request) {
  const traceId = uuidv4();
  const method = "POST";
  const contextName = "api/v1/users/[id]";
  const body = await request.json();
  const startTime = Date.now();
  const headersList = await headers();
  const authorization = headersList.get("authorization");
  const accessToken = authorization?.replace("Bearer ", "");

  logger.info(`${method} ${contextName}`, {
    additionalInfo: {
      traceId,
      type: "REQUEST",
      reqData: {
        method,
        epUrl: `api/v1/users`,
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
    const jwtData = validateToken({ type: "access_token", token: accessToken }) as unknown as JWTPayload;

    // START ACCESS AND ROLE VALIDATION
    const rejectAccess = await accessRoleValidation({
      userRole: (jwtData as UserType).role,
      allowedRoles: [UserRole.SUPERADMIN, UserRole.ADMIN],
      traceId,
      method,
      contextName,
      startTime,
      jwtData,
    });

    if (rejectAccess) {
      return rejectAccess;
    }
    // END ACCESS AND ROLE VALIDATION

    const { email, password, username } = body;

    if (!email || !password || !username) {
      const responseTime = Date.now() - startTime;
      return rejectApiResponse({
        traceId,
        responseHttp: 400,
        method,
        contextName,
        responseTime,
        customMessage: "Missing required fields: email, password, username.",
      });
    }

    // Check if user already exists
    const userExists = await getUserByEmail(email);
    if (userExists) {
      const responseTime = Date.now() - startTime;
      return rejectApiResponse({ traceId, responseHttp: 409, method, contextName, responseTime });
    }

    // Create user
    const result = await signUp(email, password, username);

    if (!result.success) {
      const responseTime = Date.now() - startTime;
      return rejectApiResponse({
        traceId,
        responseHttp: 400,
        method,
        contextName,
        responseTime,
        customMessage: result.message,
      });
    }

    const responseHttp = 201;
    const responseTime = Date.now() - startTime;
    const apiResponse = {
      traceId,
      code: "00",
      message: "User created successfully.",
      data: result.data,
    } as APIResponse;

    logger.info(`${method} ${contextName}`, {
      additionalInfo: {
        traceId,
        type: "RESPONSE",
        responseTime,
        resData: {
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
      customMessage: "Invalid or expired token.",
      error,
    });
  }
}
