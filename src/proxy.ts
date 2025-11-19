// ⚠️ This middleware has been temporarily disabled to avoid unnecessary edge function executions.
// To re-enable, rename this file to `middleware.ts`.
import { NextRequest, NextResponse } from "next/server";

import { authMiddleware } from "./middleware/auth-middleware";
import { securityHeadersMiddleware } from "./middleware/security-headers-middleware";

export function proxy(req: NextRequest) {
  // Security headers middleware, use { contentSecurityPolicyHeaderValue, requestHeaders } if you want to set the CSP header in the response.
  const { requestHeaders } = securityHeadersMiddleware(req);

  // authMiddleware
  authMiddleware(req);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  // use this if response.headers.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    "/dashboard/:path*",
    "/auth/login",
  ],
};
