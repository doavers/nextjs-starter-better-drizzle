import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { UserRole } from "@/config/role-config";
import { isAllowedRole } from "@/lib/api/role-validation";
import { auth } from "@/lib/auth";

export async function requireRole(requiredRoles: UserRole | UserRole[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  if (!session.user.role || !isAllowedRole(session.user.role, allowedRoles)) {
    // Redirect to dashboard with access denied message or show unauthorized page
    redirect("/unauthorized");
  }

  return session;
}

export async function requireAdmin() {
  return requireRole([UserRole.SUPERADMIN, UserRole.ADMIN]);
}

export async function requireSuperAdmin() {
  return requireRole(UserRole.SUPERADMIN);
}
