/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Plus, Users } from "lucide-react";
import * as React from "react";
import { useState, useEffect } from "react";
import z from "zod";

import { DataTable as DataTableNew } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { withDndColumn } from "@/components/data-table/table-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { dashboardColumns } from "./columns";
import { sectionSchema } from "./schema";
import { userColumns } from "./user-columns";
import { User, userSchema } from "./user-schema";

export function DataTable({ data: initialData }: { data: z.infer<typeof sectionSchema>[] }) {
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Fetch recent users
  useEffect(() => {
    async function fetchUsers() {
      try {
        setUsersLoading(true);
        // Better Auth will automatically include auth headers
        const response = await fetch("/api/v1/dashboard/stats");
        if (!response.ok) throw new Error("Failed to fetch users");
        const result = await response.json();
        if (result.code === "00") {
          const parsedUsers = result.data.recentData.users.map((user: any) => userSchema.parse(user));
          setUsers(parsedUsers);
        } else {
          throw new Error(result.error || "Unknown error");
        }
      } catch (err) {
        setUsersError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setUsersLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const [data, setData] = React.useState(() => initialData);
  const dashboardCols = withDndColumn(dashboardColumns);
  const userCols = userColumns;
  const table = useDataTableInstance({ data, columns: dashboardCols, getRowId: (row) => row.id.toString() });
  const userTable = useDataTableInstance({ data: users, columns: userCols, getRowId: (row) => row.id });

  return (
    <Tabs defaultValue="sections" className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="sections">
          <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sections">Sections</SelectItem>
            <SelectItem value="recent-users">Recent Users</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="recent-users">
            Recent Users <Badge variant="secondary">{users.length}</Badge>
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} />
          <Button variant="outline" size="sm">
            <Plus />
            <span className="hidden lg:inline">Add Section</span>
          </Button>
        </div>
      </div>

      <TabsContent value="sections" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={dashboardCols} onReorder={setData} />
        </div>
        <DataTablePagination table={table} />
      </TabsContent>

      <TabsContent value="recent-users" className="relative flex flex-col gap-4 overflow-auto">
        {usersLoading ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="size-5" />
              <h3 className="text-lg font-semibold">Recent Users</h3>
            </div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 rounded-lg border p-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </div>
        ) : usersError ? (
          <div className="text-muted-foreground flex h-32 items-center justify-center">{usersError}</div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="size-5" />
              <h3 className="text-lg font-semibold">Recent Users</h3>
              <Badge variant="secondary">{users.length} users</Badge>
            </div>
            <div className="overflow-hidden rounded-lg border">
              <DataTableNew table={userTable} columns={userCols} />
            </div>
            <DataTablePagination table={userTable} />
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
