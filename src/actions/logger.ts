"use server";

import logger from "@/lib/logger";

export const writeLogger = async ({
  traceId,
  hostId,
  level,
  action,
  additionalInfo,
}: {
  traceId: string;
  hostId: string;
  level: string;
  action: string;
  additionalInfo: object;
}) => {
  try {
    if (level.toUpperCase() === "INFO") {
      logger.info(action, {
        additionalInfo: {
          traceId,
          ...additionalInfo,
        },
      });
      return true;
    }
    if (level.toUpperCase() === "WARN") {
      logger.warn(action, {
        additionalInfo: {
          traceId,
          ...additionalInfo,
        },
      });
      return true;
    }
    if (level.toUpperCase() === "ERROR") {
      logger.error(action, {
        additionalInfo: {
          traceId,
          ...additionalInfo,
        },
      });
      return true;
    }
  } catch (e) {
    logger.error("writeLogger", {
      additionalInfo: {
        traceId,
        message: "ERROR",
        hostId,
        errors: e instanceof Error ? e.message : String(e),
      },
    });
    return false;
  }
};
