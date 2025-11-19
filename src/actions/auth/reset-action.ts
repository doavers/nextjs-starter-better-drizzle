"use server";

import z from "zod";

import { getUserByEmailAction } from "@/actions/common/user-action";
import { API_CONFIG } from "@/config/api-config";
import { ResetSchema } from "@/schemas/auth";
import { APIResponse } from "@/types/api/api-response";

export const resetAction = async (traceId: string, values: z.infer<typeof ResetSchema>) => {
  const startTime = Date.now();
  let responseTime = Date.now() - startTime;
  let apiRes: APIResponse = {
    traceId,
    code: "99",
    message: API_CONFIG.responseMaping.find((item) => item.code === "99")?.message ?? "Unknown error occurred",
    data: null,
    responseAt: Date.now().toLocaleString(),
    timeConsume: responseTime,
  };

  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    responseTime = Date.now() - startTime;
    apiRes = {
      traceId,
      code: "01",
      message: "Invalid email!",
      data: null,
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    };

    return apiRes;
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmailAction(traceId, email);

  if (existingUser.code != "00") {
    responseTime = Date.now() - startTime;
    apiRes = {
      traceId,
      code: "01",
      message: "Email not found!",
      data: null,
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    };

    return apiRes;
  }

  const passwordResetToken = await requestPasswordResetAction(traceId, email);

  return passwordResetToken;
};

export const requestPasswordResetAction = async (traceId: string, email: string) => {
  const startTime = Date.now();

  let responseTime = Date.now() - startTime;
  let apiRes: APIResponse = {
    traceId,
    code: "99",
    message: API_CONFIG.responseMaping.find((item) => item.code === "99")?.message ?? "Unknown error occurred",
    data: null,
    responseAt: Date.now().toLocaleString(),
    timeConsume: responseTime,
  } as APIResponse;

  try {
    const epUrl = `${API_CONFIG.backendURL}/v1/auth/reset`;

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    };

    const response = await fetch(epUrl, options);
    const result = await response.json();
    responseTime = Date.now() - startTime;

    if (result?.code !== "00") {
      apiRes = {
        traceId,
        code: "02",
        message: API_CONFIG.responseMaping.find((item) => item.code === "02")?.message ?? "Success",
        data: [],
        responseAt: Date.now().toLocaleString(),
        timeConsume: responseTime,
      } as APIResponse;

      return apiRes;
    }

    apiRes = {
      ...result,
      traceId,
    } as APIResponse;

    return apiRes;
  } catch {
    return apiRes;
  }
};
