import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export default async function OrganizationLayout({ children }: { children: React.ReactNode }) {
  // Check if user is authenticated (any role can access organization pages now)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Role-based access control is now handled at the component level
  // Regular users can view their organizations, admins can manage all
  return <>{children}</>;
}
