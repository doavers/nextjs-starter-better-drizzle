import { env } from "process";

import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";

if (process.env.NEXT_OTEL_ENABLED === "1") {
  const traceExporter = new OTLPTraceExporter({
    url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`, // HTTP OTLP
  });

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: env.OTEL_SERVICE_NAME || "nextjs-starter-better-drizzle",
      [ATTR_SERVICE_VERSION]: env.OTEL_SERVICE_VERSION || "0.1.0",
      environment: env.NODE_ENV || "development",
    }),
    spanProcessors: [new SimpleSpanProcessor(new OTLPTraceExporter())],
    traceExporter,
  });
  sdk.start();
}
