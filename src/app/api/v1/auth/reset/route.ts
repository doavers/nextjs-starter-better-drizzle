import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { AUTH_CONFIG } from "@/config/auth-config";
import { rejectApiResponse } from "@/lib/api/reject-response";
import { auth } from "@/lib/auth";
import logger from "@/lib/logger";
import { ResetSchema } from "@/schemas/auth";
import { getUserByEmail } from "@/server/users";
import { APIResponse } from "@/types/api/api-response";

export async function POST(request: NextRequest) {
  const traceId = uuidv4();
  const method = "POST";
  const contextName = "api/v1/auth/reset";
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
    const { email } = ResetSchema.parse(body);
    if (!email) {
      const responseTime = Date.now() - startTime;
      return rejectApiResponse({
        traceId,
        responseHttp: 400,
        method,
        contextName,
        responseTime,
        customMessage: "Email is required",
      });
    }

    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      const responseTime = Date.now() - startTime;
      return rejectApiResponse({
        traceId,
        responseHttp: 401,
        method,
        contextName,
        responseTime,
        customMessage: "User not registered",
      });
    }

    const passwordResetToken = await auth.api.requestPasswordReset({
      body: {
        email, // required
        redirectTo: AUTH_CONFIG.resetPasswordPage,
      },
    });
    // const passwordResetToken = await generatePasswordResetToken(email);

    const responseHttp = 200;
    const responseTime = Date.now() - startTime;
    const apiResponse = {
      traceId,
      code: "00",
      message: "Request password reset success",
      data: passwordResetToken,
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
