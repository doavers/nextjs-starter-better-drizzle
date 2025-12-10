"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import { getUsersAction } from "@/actions/common/user-action";
import { APIPagingResponse } from "@/types/api/api-response";
import UserType from "@/types/common/user-type";

import { UserTable } from "./user-tables";
import { createColumns } from "./user-tables/columns";
import { ActionMode } from "./user-tables/options";

export default function UserListingPage({ traceId }: { traceId: string }) {
  const [actionMode] = useState<ActionMode>("normal");
  const [users, setUsers] = useState<UserType[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  // Use useQueryState to access search parameters in the client component
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageLimit] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const [sort] = useQueryState("sort");
  const [roles] = useQueryState("role");
  const [search] = useQueryState("name");
  const [categories] = useQueryState("category");

  // Fetch users whenever search parameters change
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const filters = {
          traceId,
          page,
          limit: pageLimit,
          sort: sort ?? undefined,
          roles: roles ?? undefined,
          ...(search && { search }),
          ...(categories && { categories: categories }),
        };

        const apiRes = (await getUsersAction(filters)) as APIPagingResponse;
        const total = apiRes.paging?.total ?? 0;
        const userData: UserType[] = Array.isArray(apiRes.data) ? (apiRes.data as UserType[]) : [];

        setUsers(userData);
        setTotalUsers(total);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [traceId, page, pageLimit, sort, roles, search, categories]);

  const tableColumns = createColumns(actionMode);

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <div>Loading users...</div>
      </div>
    );
  }

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

  return (
    <div className="space-y-4">
      {/* User Table */}
      <UserTable data={users} totalItems={totalUsers} columns={tableColumns} />
    </div>
  );
}

// For backward compatibility, export the original async version
export async function UserListingPageOriginal({ traceId }: { traceId: string }) {
  // For the server component version, we need to use default values
  // since we can't access search params without them being passed in
  const page = 1;
  const pageLimit = 10;
  const sort = undefined;
  const roles = undefined;
  const search = undefined;
  const categories = undefined;

  const filters = {
    traceId,
    page,
    limit: pageLimit,
    sort: sort ?? undefined,
    roles: roles ?? undefined,
    ...(search ? { search } : {}),
    ...(categories ? { categories } : {}),
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

    const tableColumns = createColumns("dropdown");

    return <UserTable data={users} totalItems={totalUsers} columns={tableColumns} />;
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
