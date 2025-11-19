"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { Text, Users } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { OrganizationType } from "@/types/common/organization-type";

import { CellAction } from "./cell-action";

export const columns: ColumnDef<OrganizationType>[] = [
  {
    accessorKey: "logo",
    id: "avatar",
    header: "LOGO",
    cell: ({ row }) => {
      const logoUrl = row.original.logo;
      const name = row.original.name;

      return (
        <div className="h-10 w-10">
          <Avatar className="h-10 w-10">
            <AvatarImage src={logoUrl || undefined} alt={name} />
            <AvatarFallback className="bg-teal-500 text-white">
              {name ? name.charAt(0).toUpperCase() : "O"}
            </AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<OrganizationType, unknown> }) => (
      <DataTableColumnHeader column={column} title="NAME" />
    ),
    cell: ({ row }) => {
      const name = row.original.name;
      const slug = row.original.slug;

      return (
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-muted-foreground text-sm">{slug}</span>
        </div>
      );
    },
    meta: {
      label: "Name",
      placeholder: "Search organizations...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "memberCount",
    header: ({ column }: { column: Column<OrganizationType, unknown> }) => (
      <DataTableColumnHeader column={column} title="MEMBERS" />
    ),
    cell: ({ cell }) => {
      const memberCount = cell.getValue() as number;
      return (
        <div className="flex items-center gap-2">
          <Users className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">{memberCount || 0}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }: { column: Column<OrganizationType, unknown> }) => (
      <DataTableColumnHeader column={column} title="CREATED AT" />
    ),
    cell: ({ cell }) => {
      const createdAt = cell.getValue() as string;
      if (!createdAt) return <span className="text-muted-foreground text-sm">-</span>;

      try {
        const date = new Date(createdAt);
        return (
          <div className="text-sm">
            <div>{date.toLocaleDateString()}</div>
            <div className="text-muted-foreground">{date.toLocaleTimeString()}</div>
          </div>
        );
      } catch {
        return <span className="text-muted-foreground text-sm">-</span>;
      }
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
