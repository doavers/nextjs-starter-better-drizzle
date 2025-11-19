/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

import { UserRole } from "@/config/role-config";
import { rejectApiResponse } from "@/lib/api/reject-response";
import { accessRoleValidation } from "@/lib/api/role-validation";
import { validateToken } from "@/lib/jwt";
import logger from "@/lib/logger";
import { deleteUserById, getUserByEmail, getUserById, signUp, updateUserById } from "@/server/users";
import { APIResponse } from "@/types/api/api-response";
import UserType from "@/types/common/user-type";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const traceId = uuidv4();
  const method = "POST";
  const contextName = "api/v1/users/[id]";
  const startTime = Date.now();
  // Get token from headers
  const headersList = await headers();
  const authorization = headersList.get("authorization");
  const accessToken = authorization?.replace("Bearer ", "");
  const { id } = await params;
  const body = await request.json();

  logger.info(`${method} ${contextName}`, {
    additionalInfo: {
      traceId,
      type: "REQUEST",
      reqData: {
        method,
        epUrl: `api/v1/users/${id}`,
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

    // START ACCESS AND ROLE VALIDATION
    const rejectAccess = await accessRoleValidation({
      userRole: (jwtData as UserType).role,
      allowedRoles: [UserRole.SUPERADMIN, UserRole.ADMIN],
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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const traceId = uuidv4();
  const method = "GET";
  const contextName = "api/v1/users/[id]";
  const startTime = Date.now();
  // Get token from headers
  const headersList = await headers();
  const authorization = headersList.get("authorization");
  const accessToken = authorization?.replace("Bearer ", "");
  const { id } = await params;
  const body = null;

  logger.info(`${method} ${contextName}`, {
    additionalInfo: {
      traceId,
      type: "REQUEST",
      reqData: {
        method,
        epUrl: `api/v1/users/${id}`,
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

    // START ACCESS AND ROLE VALIDATION
    const rejectAccess = await accessRoleValidation({
      userRole: (jwtData as UserType).role,
      allowedRoles: [UserRole.SUPERADMIN, UserRole.ADMIN],
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

    const user = await getUserById(id);

    const responseHttp = 200;
    const responseTime = Date.now() - startTime;
    const apiResponse = {
      traceId,
      code: "00",
      message: `GET /api/v1/users/[${id}] success`,
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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const traceId = uuidv4();
  const method = "PATCH";
  const contextName = "api/v1/users/[id]";
  const startTime = Date.now();
  // Get token from headers
  const headersList = await headers();
  const authorization = headersList.get("authorization");
  const accessToken = authorization?.replace("Bearer ", "");
  const { id } = await params;
  const body = await request.json();

  logger.info(`${method} ${contextName}`, {
    additionalInfo: {
      traceId,
      type: "REQUEST",
      reqData: {
        method,
        epUrl: `api/v1/users/${id}`,
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

    // START ACCESS AND ROLE VALIDATION
    const rejectAccess = await accessRoleValidation({
      userRole: (jwtData as UserType).role,
      allowedRoles: [UserRole.SUPERADMIN, UserRole.ADMIN],
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

    // Only allow updating certain fields for security
    const allowedFields = ["name", "email", "role", "banned", "banExpires"];
    const updateData: Record<string, any> = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      const responseTime = Date.now() - startTime;
      return rejectApiResponse({
        traceId,
        responseHttp: 400,
        method,
        contextName,
        responseTime,
        customMessage: "Invalid data to update",
      });
    }

    // Update user in DB
    const updatedUser = await updateUserById(id, updateData);

    const responseHttp = 200;
    const responseTime = Date.now() - startTime;
    const apiResponse = {
      traceId,
      code: "00",
      message: `PATCH /api/v1/users/[${id}] success`,
      data: updatedUser,
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const traceId = uuidv4();
  const method = "PUT";
  const contextName = "api/v1/users/[id]";
  const startTime = Date.now();
  // Get token from headers
  const headersList = await headers();
  const authorization = headersList.get("authorization");
  const accessToken = authorization?.replace("Bearer ", "");
  const { id } = await params;
  const body = await request.json();

  logger.info(`${method} ${contextName}`, {
    additionalInfo: {
      traceId,
      type: "REQUEST",
      reqData: {
        method,
        epUrl: `api/v1/users/${id}`,
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

    // START ACCESS AND ROLE VALIDATION
    const rejectAccess = await accessRoleValidation({
      userRole: (jwtData as UserType).role,
      allowedRoles: [UserRole.SUPERADMIN, UserRole.ADMIN],
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

    const { email, password, username, role, banned, banExpires } = body;

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

    // Update user in DB with full replacement of details
    const updateData = { email, password, username, role, banned, banExpires };
    const updatedUser = await updateUserById(id, updateData);

    const responseHttp = 200;
    const responseTime = Date.now() - startTime;
    const apiResponse = {
      traceId,
      code: "00",
      message: `PUT /api/v1/users/[${id}] success`,
      data: updatedUser,
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const traceId = uuidv4();
  const method = "DELETE";
  const contextName = "api/v1/users/[id]";
  const startTime = Date.now();
  // Get token from headers
  const headersList = await headers();
  const authorization = headersList.get("authorization");
  const accessToken = authorization?.replace("Bearer ", "");
  const { id } = await params;
  const body = null;

  logger.info(`${method} ${contextName}`, {
    additionalInfo: {
      traceId,
      type: "REQUEST",
      reqData: {
        method,
        epUrl: `api/v1/users/${id}`,
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

    // START ACCESS AND ROLE VALIDATION
    const rejectAccess = await accessRoleValidation({
      userRole: (jwtData as UserType).role,
      allowedRoles: [UserRole.SUPERADMIN, UserRole.ADMIN],
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

    const user = await deleteUserById(id);

    const responseHttp = 200;
    const responseTime = Date.now() - startTime;
    const apiResponse = {
      traceId,
      code: "00",
      message: `DELETE /api/v1/users/[${id}] success`,
      data: user,
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
      customMessage: "Invalid or expired token",
      error,
    });
  }
}
