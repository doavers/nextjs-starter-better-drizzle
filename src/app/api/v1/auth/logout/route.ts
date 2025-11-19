import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { rejectApiResponse } from "@/lib/api/reject-response";
import { removeCookie } from "@/lib/cookie";
import logger from "@/lib/logger";
import { APIResponse } from "@/types/api/api-response";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const traceId = uuidv4();
  const method = "POST";
  const contextName = "api/v1/auth/login";
  const body = await request.json();
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
    const accessTokenCookies = request.cookies.get("accessToken");
    if (accessTokenCookies) {
      await removeCookie("accessToken");
    }
    const refreshTokenCookies = request.cookies.get("refreshToken");
    if (refreshTokenCookies) {
      await removeCookie("refreshToken");
    }

    const responseHttp = 200;
    const responseTime = Date.now() - startTime;
    const apiResponse = {
      traceId,
      code: "00",
      message: "Logged out successfully",
      data: null,
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
