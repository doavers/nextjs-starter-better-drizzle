"use server";

import { cookies } from "next/headers";

export async function setAccessToken(accessToken: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "access_token",
    value: accessToken,
    httpOnly: true,
    path: "/",
    secure: true,
  });
}

export async function deletesAccessToken() {
  (await cookies()).delete("access_token");
}
