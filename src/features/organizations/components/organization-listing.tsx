import { headers } from "next/headers";

import { getOrganizationsAction, getUserOrganizationsAction } from "@/actions/common/organization-action";
import { auth } from "@/lib/auth";
import { searchParamsCache } from "@/lib/searchparams";
import { APIPagingResponse } from "@/types/api/api-response";
import { OrganizationType } from "@/types/common/organization-type";

import { OrganizationTable } from "./organization-tables";
import { columns } from "./organization-tables/columns";

export default async function OrganizationListingPage({ traceId }: { traceId: string }) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const search = searchParamsCache.get("name");

  const filters = {
    traceId,
    page,
    limit: pageLimit,
    sort: sort ?? undefined,
    ...(search && { search }),
  };

  try {
    // Get current user session to determine role
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userRole = session?.user?.role;

    // Use appropriate action based on user role
    let apiRes: APIPagingResponse;

    if (userRole === "superadmin" || userRole === "admin") {
      apiRes = (await getOrganizationsAction(filters)) as APIPagingResponse;
    } else {
      apiRes = (await getUserOrganizationsAction(filters)) as APIPagingResponse;
    }
    const totalOrganizations = apiRes.paging?.total ?? 0;
    const organizations: OrganizationType[] = Array.isArray(apiRes.data) ? (apiRes.data as OrganizationType[]) : [];

    // Handle empty state
    if (organizations.length === 0 && totalOrganizations === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-muted-foreground mt-2 text-sm font-semibold">No organizations found</h3>
            <p className="text-muted-foreground mt-1 text-sm">Get started by creating a new organization.</p>
          </div>
        </div>
      );
    }

    // Handle search/filter with no results
    if (organizations.length === 0 && totalOrganizations > 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-muted-foreground mt-2 text-sm font-semibold">No organizations match your filters</h3>
            <p className="text-muted-foreground mt-1 text-sm">Try adjusting your search criteria or filters.</p>
          </div>
        </div>
      );
    }

    return <OrganizationTable data={organizations} totalItems={totalOrganizations} columns={columns} />;
  } catch (error) {
    console.error("Error loading organizations:", error);
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="mt-2 text-sm font-semibold text-red-600">Error loading organizations</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            There was a problem loading the organizations. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
