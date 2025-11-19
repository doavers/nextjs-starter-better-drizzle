import { auth } from "@/lib/auth";

export async function getAuthenticatedUser(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return null;
    }

    return {
      user: session.user,
      session: session,
    };
  } catch (error) {
    console.error("Failed to get authenticated user:", error);
    return null;
  }
}
