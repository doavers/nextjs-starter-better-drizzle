import { randomUUID } from "crypto";

import { checkHealth } from "@/actions/health";
import { APIResponse } from "@/types/api/api-response";

export async function GET(req: Request) {
  const start = Date.now();
  const traceId = randomUUID();
  const hostId = req.headers.get("x-host-id") ?? undefined;

  // Parse body (assuming JSON)
  let body = {};
  try {
    body = await req.json();
  } catch {
    // If no body or not JSON, keep as empty object
  }

  // Parse query params
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const apiRes = await checkHealth({
    traceId,
    hostId,
    reqData: {
      url: req.url,
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      body,
      params,
    },
  });

  const resHeaders = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; frame-ancestors 'none';",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Host-Id",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
    "X-Trace-ID": traceId,
    "X-Host-ID": hostId ?? "unknown",
    "X-Response-Time": `${Date.now() - start}ms`,
    "X-Environment": process.env.NODE_ENV,
  };

  return Response.json(
    {
      traceId,
      code: "00",
      message: "Health check successful",
      data: apiRes?.data,
    } as APIResponse,
    {
      status: 200,
      headers: resHeaders,
    },
  );
}

export async function POST(req: Request) {
  const start = Date.now();
  const traceId = randomUUID();
  const hostId = req.headers.get("x-host-id") ?? undefined;

  // Parse body (assuming JSON)
  let body = {};
  try {
    body = await req.json();
  } catch {
    // If no body or not JSON, keep as empty object
  }

  // Parse query params
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const apiRes = await checkHealth({
    traceId,
    hostId,
    reqData: {
      url: req.url,
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      body,
      params,
    },
  });

  const resHeaders = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; frame-ancestors 'none';",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Host-Id",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
    "X-Trace-ID": traceId,
    "X-Host-ID": hostId ?? "unknown",
    "X-Response-Time": `${Date.now() - start}ms`,
    "X-Environment": process.env.NODE_ENV,
  };

  return Response.json(
    {
      traceId,
      code: "00",
      message: "Health check successful",
      data: apiRes?.data,
    } as APIResponse,
    {
      status: 200,
      headers: resHeaders,
    },
  );
}
