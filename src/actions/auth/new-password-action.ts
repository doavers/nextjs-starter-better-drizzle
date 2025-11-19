"use server";

import z from "zod";

import { API_CONFIG } from "@/config/api-config";
import { safeCompare } from "@/lib/string";
import { NewPasswordSchema } from "@/schemas/auth";
import { updatePassowrdByToken } from "@/server/account";
import { APIResponse } from "@/types/api/api-response";

export const newPasswordAction = async (
  traceId: string,
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
) => {
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

  try {
    if (!token) {
      responseTime = Date.now() - startTime;
      apiRes = {
        traceId,
        code: "01",
        message: "Missing token!",
        data: null,
        responseAt: Date.now().toLocaleString(),
        timeConsume: responseTime,
      };

      return apiRes;
    }

    const validatedFields = NewPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
      responseTime = Date.now() - startTime;
      apiRes = {
        traceId,
        code: "01",
        message: "Invalid fields!",
        data: null,
        responseAt: Date.now().toLocaleString(),
        timeConsume: responseTime,
      };

      return apiRes;
    }

    const { password, confirmPassword } = validatedFields.data;
    if (!safeCompare(password, confirmPassword)) {
      responseTime = Date.now() - startTime;
      apiRes = {
        traceId,
        code: "01",
        message: "Invalid confirm password!",
        data: null,
        responseAt: Date.now().toLocaleString(),
        timeConsume: responseTime,
      };

      return apiRes;
    }

    const updatePass = await updatePassowrdByToken(password, token).then((data) => {
      if (data && data.status) {
        responseTime = Date.now() - startTime;
        apiRes = {
          traceId,
          code: "00",
          message: "Set new password success!",
          data,
          responseAt: Date.now().toLocaleString(),
          timeConsume: responseTime,
        };
      } else {
        const responseTime = Date.now() - startTime;
        apiRes = {
          traceId,
          code: "01",
          message: "Set new password failed!",
          data,
          responseAt: Date.now().toLocaleString(),
          timeConsume: responseTime,
        };
      }
      return apiRes;
    });

    return updatePass;
  } catch (error) {
    console.log("Error", error);
    const responseTime = Date.now() - startTime;
    apiRes = {
      traceId,
      code: "01",
      message: "Set new password error!",
      data: null,
      responseAt: Date.now().toLocaleString(),
      timeConsume: responseTime,
    };
    return apiRes;
  }
};
