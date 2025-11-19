import { PlusIcon, Building2Icon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export async function OrganizationHeader() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userRole = session?.user?.role;
  const isAdmin = userRole === "superadmin" || userRole === "admin";

  return (
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <Building2Icon className="h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">
          {isAdmin ? "Organization Management" : "My Organizations"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {isAdmin ? "Manage organizations and their settings" : "View organizations you are a member of"}
        </p>
      </div>
      {isAdmin && (
        <Link href="/dashboard/organization/new" className={cn(buttonVariants(), "gap-2 text-xs md:text-sm")}>
          <PlusIcon className="h-4 w-4" />
          Add New Organization
        </Link>
      )}
    </div>
  );
}
