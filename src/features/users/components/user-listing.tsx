import { getUsersAction } from "@/actions/common/user-action";
import { searchParamsCache } from "@/lib/searchparams";
import { APIPagingResponse } from "@/types/api/api-response";
import UserType from "@/types/common/user-type";

import { UserTable } from "./user-tables";
import { columns } from "./user-tables/columns";

export default async function UserListingPage({ traceId }: { traceId: string }) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const roles = searchParamsCache.get("role");
  const search = searchParamsCache.get("name");
  const categories = searchParamsCache.get("category");

  const filters = {
    traceId,
    page,
    limit: pageLimit,
    sort: sort ?? undefined,
    roles: roles ?? undefined,
    ...(search && { search }),
    ...(categories && { categories: categories }),
  };

  try {
    const apiRes = (await getUsersAction(filters)) as APIPagingResponse;
    const totalUsers = apiRes.paging?.total ?? 0;
    const users: UserType[] = Array.isArray(apiRes.data) ? (apiRes.data as UserType[]) : [];

    // Handle empty state
    if (users.length === 0 && totalUsers === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-muted-foreground mt-2 text-sm font-semibold">No users found</h3>
            <p className="text-muted-foreground mt-1 text-sm">Get started by creating a new user.</p>
          </div>
        </div>
      );
    }

    // Handle search/filter with no results
    if (users.length === 0 && totalUsers > 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-muted-foreground mt-2 text-sm font-semibold">No users match your filters</h3>
            <p className="text-muted-foreground mt-1 text-sm">Try adjusting your search criteria or filters.</p>
          </div>
        </div>
      );
    }

    return <UserTable data={users} totalItems={totalUsers} columns={columns} />;
  } catch (error) {
    console.error("Error loading users:", error);
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="mt-2 text-sm font-semibold text-red-600">Error loading users</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            There was a problem loading the users. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
