import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

import { AUTH_CONFIG } from "@/config/auth-config";

const protectedRoutes = ["/dashboard", "/profile"];
const loginPath = AUTH_CONFIG.loginPage;

export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = getSessionCookie(request);

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !session) {
    // redirect the user to the auth page
    // because user is not logged in
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  const isLoggedIn = request.cookies.get("auth-token");

  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  if (isLoggedIn && pathname === loginPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
