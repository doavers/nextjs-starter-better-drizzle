import { adminClient, jwtClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  plugins: [adminClient(), jwtClient(), organizationClient()],
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: () => localStorage.getItem("bearer_token") || "", // get the token from localStorage
    },
    onSuccess: (ctx) => {
      const authToken = ctx.response.headers.get("set-auth-token"); // get the token from the response headers
      // Store the token securely (e.g., in localStorage)
      if (authToken) {
        localStorage.setItem("bearer_token", authToken);
      }

      const jwt = ctx.response.headers.get("set-auth-jwt");
      if (jwt) {
        localStorage.setItem("bearer_jwt", jwt);
      }
    },
  },
});

export const { signIn, signOut, signUp, useSession, getSession, getAccessToken } = authClient;
