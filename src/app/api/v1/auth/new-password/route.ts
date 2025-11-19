import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { rejectApiResponse } from "@/lib/api/reject-response";
import { auth } from "@/lib/auth";
import logger from "@/lib/logger";
import { NewPasswordApiSchema } from "@/schemas/auth";
import { APIResponse } from "@/types/api/api-response";

export async function POST(request: NextRequest) {
  const traceId = uuidv4();
  const method = "POST";
  const contextName = "api/v1/auth/new-passowrd";
  const body = await request.json();
  const startTime = Date.now();
  const headersList = await headers();

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
    const { token, password } = NewPasswordApiSchema.parse(body);
    if (!token || !password) {
      const responseTime = Date.now() - startTime;
      return rejectApiResponse({
        traceId,
        responseHttp: 400,
        method,
        contextName,
        responseTime,
        customMessage: "Token or Password is required",
      });
    }

    const data = await auth.api.resetPassword({
      body: {
        newPassword: password, // required
        token, // required
      },
    });
    // const data = await getPasswordResetToken(token);

    if (!data.status) {
      const responseTime = Date.now() - startTime;
      return rejectApiResponse({
        traceId,
        responseHttp: 400,
        method,
        contextName,
        responseTime,
        customMessage: "Token not found",
      });
    }

    const responseHttp = 200;
    const responseTime = Date.now() - startTime;
    const apiResponse = {
      traceId,
      code: "00",
      message: "Set new password success",
      data: data,
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
      responseHttp: 500,
      method,
      contextName,
      responseTime,
      customMessage: "Something went wrong",
      error,
    });
  }
}
