/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { jwtVerify, createRemoteJWKSet, importPKCS8, SignJWT, importSPKI } from "jose";

import { API_CONFIG } from "@/config/api-config";
import { APP_CONFIG } from "@/config/app-config";

export const jwtSign = async ({ type, data, expires }: { type: string; data: any; expires?: string }) => {
  let privateKeyStr = "";
  let expiresStr = "";
  if (type === "access_token") {
    privateKeyStr = API_CONFIG.accessTokenSecret;
    if (expires) {
      expiresStr = expires;
    } else {
      expiresStr = API_CONFIG.accessTokenExpired;
    }
  } else if (type === "refresh_token") {
    privateKeyStr = API_CONFIG.refreshTokenSecret;
    if (expires) {
      expiresStr = expires;
    } else {
      expiresStr = API_CONFIG.refreshTokenExpired;
    }
  }

  const privateKey = await importPKCS8(privateKeyStr, "RS256");

  const jwt = await new SignJWT(data)
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setExpirationTime(expiresStr)
    .sign(privateKey);

  return jwt;
};

export const validateToken = async ({ type, token }: { type: string; token: string }) => {
  try {
    if (type === "access_token") {
      const JWKS = createRemoteJWKSet(new URL(`${API_CONFIG.backendURL}/auth/jwks`));
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: APP_CONFIG.url, // Should match your JWT issuer, which is the BASE_URL
        audience: APP_CONFIG.url, // Should match your JWT audience, which is the BASE_URL by default
      });
      return payload;
    } else {
      const JWKS = createRemoteJWKSet(new URL(`${API_CONFIG.backendURL}/auth/jwks`));
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: APP_CONFIG.url, // Should match your JWT issuer, which is the BASE_URL
        audience: APP_CONFIG.url, // Should match your JWT audience, which is the BASE_URL by default
      });
      return payload;
    }
  } catch (error) {
    console.error("Token validation failed:", error);
    throw error;
  }
};

export const validateTokenCustom = async ({ type, token }: { type: string; token: string }) => {
  let publicKeyStr = "";
  if (type === "access_token") {
    publicKeyStr = API_CONFIG.accessTokenVerify;
  } else if (type === "refresh_token") {
    publicKeyStr = API_CONFIG.refreshTokenVerify;
  }

  const publicKey = await importSPKI(publicKeyStr, "RS256");

  const verify = await jwtVerify(token, publicKey);

  return verify;
};
