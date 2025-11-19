import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ShieldCheck, ShieldX, Mail, MailCheck } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { User } from "./user-schema";

const statusColors = {
  superadmin: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  admin: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  user: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  unknown: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

const statusIcons = {
  superadmin: ShieldCheck,
  admin: ShieldCheck,
  user: ShieldX,
  unknown: ShieldX,
};

export const userColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      return <div className="max-w-[200px] truncate">{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => {
      const role = (row.getValue("role") as string) || "unknown";
      const Icon = statusIcons[role as keyof typeof statusIcons] || statusIcons.unknown;

      return (
        <div className="flex items-center gap-2">
          <Icon className="size-4" />
          <Badge variant="outline" className={statusColors[role as keyof typeof statusColors] || statusColors.unknown}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email Status" />,
    cell: ({ row }) => {
      const isVerified = row.getValue("emailVerified") as boolean;

      return (
        <div className="flex items-center gap-2">
          {isVerified ? (
            <>
              <MailCheck className="size-4 text-green-600" />
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Verified
              </Badge>
            </>
          ) : (
            <>
              <Mail className="size-4 text-yellow-600" />
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
              >
                Pending
              </Badge>
            </>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "banned",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const isBanned = row.getValue("banned") as boolean;

      return (
        <Badge
          variant={isBanned ? "destructive" : "default"}
          className={isBanned ? "" : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"}
        >
          {isBanned ? "Banned" : "Active"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-muted-foreground text-sm">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <MoreHorizontal />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit user</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant={user.banned ? "default" : "destructive"}>
              {user.banned ? "Unban user" : "Ban user"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
  },
];
