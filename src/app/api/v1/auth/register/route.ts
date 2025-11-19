import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { UserRole } from "@/config/role-config";
import { rejectApiResponse } from "@/lib/api/reject-response";
import logger from "@/lib/logger";
import { RegisterApiSchema } from "@/schemas/auth";
import { getUserByEmail, signUp, updateUserRoleByEmail } from "@/server/users";
import { APIResponse } from "@/types/api/api-response";

export async function POST(request: NextRequest) {
  const traceId = uuidv4();
  const method = "POST";
  const contextName = "api/v1/auth/register";
  const startTime = Date.now();
  const headersList = await headers();
  const body = await request.json();

  logger.info(`${method} ${contextName}`, {
    additionalInfo: {
      traceId,
      type: "REQUEST",
      reqData: {
        method,
        epUrl: contextName,
        headers: headersList,
        body,
      },
    },
  });

  try {
    const { name, email, password, role } = RegisterApiSchema.parse(body);
    if (!email || !password) {
      const responseTime = Date.now() - startTime;
      return rejectApiResponse({
        traceId,
        responseHttp: 400,
        method,
        contextName,
        responseTime,
        customMessage: "Email or Password is required.",
      });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      const responseTime = Date.now() - startTime;
      return rejectApiResponse({
        traceId,
        responseHttp: 401,
        method,
        contextName,
        responseTime,
        customMessage: "User already registered.",
      });
    }

    const signedupUser = await signUp(email, password, name);
    if (signedupUser.success) {
      await updateUserRoleByEmail(email, role ?? UserRole.USER);

      const responseHttp = 201;
      const responseTime = Date.now() - startTime;
      const apiResponse = {
        traceId,
        code: "00",
        message: "Register success",
        data: {
          user: signedupUser.data?.user,
        },
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
    } else {
      const responseTime = Date.now() - startTime;
      return rejectApiResponse({
        traceId,
        responseHttp: 500,
        method,
        contextName,
        responseTime,
        customMessage: signedupUser.message,
      });
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return rejectApiResponse({
      traceId,
      responseHttp: 500,
      method,
      contextName,
      responseTime,
      customMessage: "Something went wrong",
      error,
    });
  }
}
