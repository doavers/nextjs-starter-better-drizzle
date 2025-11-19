"use client";

/**
 * Client-side cookie utilities for browser usage
 */

export function getClientCookie(key: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === key) {
      return decodeURIComponent(value);
    }
  }
  return undefined;
}

export function setClientCookie(
  key: string,
  value: string,
  options: {
    path?: string;
    maxAge?: number;
    domain?: string;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
  } = {},
): void {
  if (typeof document === "undefined") return;

  let cookieString = `${key}=${encodeURIComponent(value)}`;

  if (options.path) {
    cookieString += `; path=${options.path}`;
  } else {
    cookieString += "; path=/";
  }

  if (options.maxAge) {
    cookieString += `; max-age=${options.maxAge}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.secure) {
    cookieString += "; secure";
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  } else {
    cookieString += "; samesite=lax";
  }

  document.cookie = cookieString;
}

export function removeClientCookie(key: string): void {
  if (typeof document === "undefined") return;

  setClientCookie(key, "", { maxAge: 0 });
}
