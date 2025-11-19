import { Metadata } from "next";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { v4 as uuidv4 } from "uuid";

import PageContainer from "@/components/dashboard/layout/page-container";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrganizationHeader } from "@/features/organizations/components/organization-header";
import OrganizationListingPage from "@/features/organizations/components/organization-listing";
import { searchParamsCache } from "@/lib/searchparams";

export const metadata: Metadata = {
  title: "Dashboard: Organizations",
  description:
    "View and manage organizations (Admins can manage all organizations, Users can view their member organizations)",
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const traceId = uuidv4();
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-6">
        {/* Header Section */}
        <Suspense fallback={<div className="bg-muted h-20 animate-pulse rounded-lg" />}>
          <OrganizationHeader />
        </Suspense>

        {/* Main Content */}
        <Card className="flex-1">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg font-semibold">Organizations</CardTitle>
            <CardDescription>View your organizations. Admins can manage all organizations.</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <Suspense
              fallback={
                <div className="p-6">
                  <DataTableSkeleton columnCount={5} rowCount={10} filterCount={3} />
                </div>
              }
            >
              <div className="mx-2 md:mx-2 lg:mx-2">
                <OrganizationListingPage traceId={traceId} />
              </div>
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
