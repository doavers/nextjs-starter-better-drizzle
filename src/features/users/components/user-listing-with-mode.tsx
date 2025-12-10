"use client";

import React, { useState } from "react";

import { getUsersAction } from "@/actions/common/user-action";
import { APIPagingResponse } from "@/types/api/api-response";
import UserType from "@/types/common/user-type";

import { UserTable } from "./user-tables";
import { createColumns } from "./user-tables/columns";
import { ActionMode } from "./user-tables/options";

interface UserListingPageWithModeProps {
  traceId: string;
}

export default function UserListingPageWithMode({ traceId }: UserListingPageWithModeProps) {
  const [actionMode] = useState<ActionMode>("dropdown");
  const [users, setUsers] = useState<UserType[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch users on component mount
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const filters = {
          traceId,
          page: 1,
          limit: 10,
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
  }, [traceId]);

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
