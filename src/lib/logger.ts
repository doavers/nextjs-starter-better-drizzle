import winston from "winston";

import { removeCircularReferences } from "@/lib/common";
import { getServerIP } from "@/lib/network";

import { toIso8601String } from "./datetime";

// Define the logger instance
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: () => toIso8601String(new Date()) }),
    winston.format.printf(({ timestamp, level, label, contextName, method, message, metadata, additionalInfo }) => {
      const defaultMeta = {
        ctxName: contextName,
        method,
      };
      const metadataObj = metadata != null ? { metadata, ...defaultMeta } : defaultMeta;

      const addInfo =
        additionalInfo != null
          ? JSON.stringify(additionalInfo, removeCircularReferences())
          : JSON.stringify({
              traceId: "uuid",
              type: "string",
              refId: "uuid",
              invId: "string",
              message: "Log",
              reqData: {},
              resData: {},
              responseTime: 0,
              info: {},
              error: {},
            });
      const addInfoObj = JSON.parse(addInfo);
      const endpoint = `${process.env.APP_NAME ?? label}@${getServerIP()}`;
      const action = `${message}`;
      const type = addInfoObj?.type ?? "string";
      const refId = addInfoObj?.refId ?? "";
      const invId = addInfoObj?.invId ?? "";
      const traceId = addInfoObj?.traceId ?? addInfoObj?.resData?.traceId ?? "";
      const timeConsume = addInfoObj?.responseTime ?? 0;
      const jsonData = JSON.stringify({
        logData: addInfoObj,
        metadata: metadataObj,
      });
      return `${level.toUpperCase()}|${timestamp}|${traceId}|${endpoint}|${action}|${type}|${refId}|${invId}|${timeConsume}|${jsonData}`;
    }),
  ),
  transports: [
    // Console transport for development
    new winston.transports.Console(),
    new winston.transports.File({
      filename: `logs/combined-${new Date().toISOString().split("T")[0]}.log`,
    }),
    // Daily rotate file transport
    // new DailyRotateFile({
    //   filename: 'logs/application-%DATE%.log',
    //   datePattern: 'YYYY-MM-DD',
    //   zippedArchive: true,
    //   maxSize: '20m',
    //   maxFiles: '14d',
    // }),
  ],
});

// Export the logger instance
export default logger;
