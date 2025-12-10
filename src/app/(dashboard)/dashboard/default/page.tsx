"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ChartAreaInteractive } from "@/components/dashboard/default/chart-area-interactive";
import { DataTable } from "@/components/dashboard/default/data-table";
import { SectionCards } from "@/components/dashboard/default/section-cards";
import { NoOrganizationSuggestion } from "@/components/organization/no-organization-suggestion";
import { UserRole } from "@/config/role-config";
import { useOrganizationContext } from "@/hooks/use-organization-context";
import { useSession } from "@/lib/auth-client";

export default function Page() {
  const { currentOrganization, isLoading } = useOrganizationContext();
  const { data: session } = useSession();
  const user = session?.user;

  if (isLoading) {
    return (
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <div className="animate-pulse">
          <div className="bg-muted mb-4 h-8 w-1/3 rounded"></div>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-muted h-32 rounded"></div>
            ))}
          </div>
          <div className="bg-muted h-64 rounded"></div>
        </div>
      </div>
    );
  }

  if (!currentOrganization) {
    return (
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <DashboardHeader />
        <div className="flex flex-1 items-center justify-center">
          <NoOrganizationSuggestion />
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      {user?.role !== UserRole.SUPERADMIN && <DashboardHeader />}
      <SectionCards />
      <ChartAreaInteractive />
      <DataTable data={[]} />
    </div>
  );
}
