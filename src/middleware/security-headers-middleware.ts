import { type NextRequest } from "next/server";

export function securityHeadersMiddleware(req: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: ${
        process.env.NODE_ENV === "production" ? "" : `'unsafe-eval' 'unsafe-inline'`
      };
      style-src 'self' 'nonce-${nonce}' 'unsafe-inline';
      img-src 'self' blob: data: ;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
  `;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, " ").trim();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);

  return { contentSecurityPolicyHeaderValue, requestHeaders };
}
