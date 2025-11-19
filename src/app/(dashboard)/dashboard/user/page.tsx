import { PlusIcon, UsersIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { v4 as uuidv4 } from "uuid";

import { Heading } from "@/components/common/heading";
import PageContainer from "@/components/dashboard/layout/page-container";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UserListingPage from "@/features/users/components/user-listing";
import { searchParamsCache } from "@/lib/searchparams";
import { requireAdmin } from "@/lib/server-access-control";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard: Users",
  description: "Manage users, roles, and permissions",
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  // Require admin or superadmin role to access user management
  await requireAdmin();

  const traceId = uuidv4();
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Heading
              title="User Management"
              description="Manage users, roles, and permissions"
              icon={<UsersIcon className="h-6 w-6" />}
            />
          </div>
          <Link href="/dashboard/user/new" className={cn(buttonVariants(), "gap-2 text-xs md:text-sm")}>
            <PlusIcon className="h-4 w-4" />
            Add New User
          </Link>
        </div>

        {/* Main Content */}
        <Card className="flex-1">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg font-semibold">Users</CardTitle>
            <CardDescription>View, edit, and manage all user accounts in the system.</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <Suspense
              fallback={
                <div className="p-6">
                  <DataTableSkeleton columnCount={6} rowCount={10} filterCount={3} />
                </div>
              }
            >
              <div className="mx-2 md:mx-2 lg:mx-2">
                <UserListingPage traceId={traceId} />
              </div>
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
