"use server";

import axios from "axios";

import { API_CONFIG } from "@/config/api-config";
import logger from "@/lib/logger";

export const loginAndGetTokenAction = async ({ traceId, hostId }: { traceId: string; hostId?: string }) => {
  const startTime = Date.now();
  try {
    const epUrl = `${API_CONFIG.backendURL}/v1/auth/login`;
    const headers = {
      "Content-Type": "application/json",
    };
    const body = {
      email: process.env.BACKEND_AUTH_USER,
      password: process.env.BACKEND_AUTH_PASSWORD,
    };
    const resData = await axios.post(epUrl, body, { headers });
    const responseTime = Date.now() - startTime;
    const accessToken = resData.data?.data?.token?.accessToken ?? null;
    logger.info("actions/auth/loginAndGetTokenAction", {
      additionalInfo: {
        traceId,
        reqData: {
          method: "POST",
          epUrl,
          headers,
          body,
        },
        resData: resData.data,
        info: { accessToken },
        responseTime,
      },
    });

    return accessToken;
  } catch (e: unknown) {
    const responseTime = Date.now() - startTime;
    logger.error("actions/auth/loginAndGetTokenAction", {
      additionalInfo: {
        traceId,
        message: "ERROR",
        hostId,
        responseTime,
        errors: e instanceof Error ? e.message : String(e),
      },
    });
    return null;
  }
};
