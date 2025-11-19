import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { rejectApiResponse } from "@/lib/api/reject-response";
import logger from "@/lib/logger";
import { LoginApiSchema } from "@/schemas/auth";
import { userEmailSignIn } from "@/server/users";
import { APIResponse } from "@/types/api/api-response";

export async function POST(request: NextRequest) {
  const traceId = uuidv4();
  const method = "POST";
  const contextName = "api/v1/auth/login";
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
    const { email, password } = LoginApiSchema.parse(body);
    if (!email || !password) {
      const responseTime = Date.now() - startTime;
      return rejectApiResponse({
        traceId,
        responseHttp: 400,
        method,
        contextName,
        responseTime,
        customMessage: "Email or Password is required",
      });
    }

    const loggedUser = await userEmailSignIn(email, password);
    if (!loggedUser.success) {
      const responseTime = Date.now() - startTime;
      return rejectApiResponse({
        traceId,
        responseHttp: 400,
        method,
        contextName,
        responseTime,
        customMessage: loggedUser.message,
      });
    }

    const accessToken = loggedUser?.data?.bearerJwt;

    const responseHttp = 200;
    const responseTime = Date.now() - startTime;
    const apiResponse = {
      traceId,
      code: "00",
      message: "Login success",
      data: {
        user: loggedUser?.data?.user,
        redirect: loggedUser.data?.redirect,
        token: {
          accessToken,
        },
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
