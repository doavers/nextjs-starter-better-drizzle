import { headers } from "next/headers";

import { UserRole } from "@/config/role-config";
import { auth } from "@/lib/auth";

export const getSessionToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  return session?.session.token;
};

export const currentUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  return session?.user;
};

export const currentRole = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  return session?.user.role ?? UserRole.USER;
};
