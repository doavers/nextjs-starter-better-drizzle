"use server";

import { IncomingHttpHeaders } from "http";

import { NextApiRequest } from "next";

import logger from "@/lib/logger";
import { APIResponse } from "@/types/api/api-response";

export const checkHealth = async ({
  traceId,
  hostId,
  reqData,
}: {
  traceId: string;
  hostId?: string;
  reqData?: {
    url?: string;
    method?: string;
    headers?: IncomingHttpHeaders;
    body?: NextApiRequest["body"];
    params?: NextApiRequest["query"];
  };
}) => {
  const now = Date.now();
  try {
    const responseTime = Date.now() - now;
    const resData = {
      traceId,
      hostId,
      message: "OK",
      data: null,
    } as APIResponse;

    logger.info("checkHealth", {
      additionalInfo: { requestData: reqData, ...resData, responseTime },
    });

    return resData;
  } catch (e) {
    const responseTime = Date.now() - now;
    const resData = {
      traceId,
      hostId,
      message: "ERROR",
      data: null,
    } as APIResponse;
    logger.error("checkHealth", {
      additionalInfo: {
        requestData: reqData,
        ...resData,
        responseTime,
        errors: e instanceof Error ? e.message : String(e),
      },
    });
    return null;
  }
};
