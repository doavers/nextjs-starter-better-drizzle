import { API_CONFIG } from "@/config/api-config";
import { APIResponse } from "@/types/api/api-response";

import logger from "../logger";

export const rejectApiResponse = ({
  traceId,
  responseHttp,
  method,
  contextName,
  responseTime,
  customMessage,
  error,
}: {
  traceId: string;
  responseHttp: number;
  method: string;
  contextName: string;
  responseTime: number;
  customMessage?: string;
  error?: unknown;
}) => {
  let responseCode = "04";
  let responseMsg = "Operation not permitted";
  if (responseHttp === 400) {
    responseCode = "01";
    responseMsg = API_CONFIG.responseMaping.find((item) => item.code === responseCode)?.message ?? "Bad Request";
  } else if (responseHttp === 401) {
    responseCode = "02";
    responseMsg =
      API_CONFIG.responseMaping.find((item) => item.code === responseCode)?.message ?? "Authentication failed";
  } else if (responseHttp === 403) {
    responseCode = "04";
    responseMsg = API_CONFIG.responseMaping.find((item) => item.code === responseCode)?.message ?? "Forbidden Access";
  } else if (responseHttp === 409) {
    responseCode = "02";
    responseMsg = API_CONFIG.responseMaping.find((item) => item.code === responseCode)?.message ?? "Bad Request";
  } else if (responseHttp === 429) {
    responseCode = "05";
    responseMsg =
      API_CONFIG.responseMaping.find((item) => item.code === responseCode)?.message ?? "Rate limit exceeded";
  } else {
    responseCode = "99";
    responseMsg =
      API_CONFIG.responseMaping.find((item) => item.code === responseCode)?.message ?? "Unknown error occurred";
  }

  const apiResponse = {
    traceId,
    code: responseCode,
    message: customMessage ?? responseMsg,
    data: null,
  } as APIResponse;

  logger.info(`${method} ${contextName}`, {
    additionalInfo: {
      traceId,
      type: "RESPONSE",
      resData: {
        headers: { responseHttp },
        body: apiResponse,
        error: error instanceof Error ? error.message : `${typeof error}: ${String(error)}`,
      },
      responseTime,
    },
  });
  return Response.json(apiResponse, { status: responseHttp });
};
