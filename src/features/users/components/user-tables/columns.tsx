"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Mail, Text, XCircle } from "lucide-react";
import Image from "next/image";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import UserType from "@/types/common/user-type";

import { CellAction } from "./cell-action";
import { ROLE_OPTIONS, ActionMode } from "./options";

export const createColumns = (mode: ActionMode = "normal"): ColumnDef<UserType>[] => [
  {
    accessorKey: "image",
    id: "avatar",
    header: "AVATAR",
    cell: ({ row }) => {
      const imageUrl = row.original.image;
      const name = row.original.name;
      console.log("Image URL:", imageUrl);
      if (!imageUrl) {
        return (
          <div className="relative aspect-square">
            <Image src={"/images/avatars/default.jpg"} alt={name} width={70} height={70} className="rounded-lg" />
          </div>
        );
      }
      return (
        <div className="relative aspect-square">
          <Image src={imageUrl} alt={name} width={70} height={70} className="rounded-lg" />
        </div>
      );
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<UserType, unknown> }) => (
      <DataTableColumnHeader column={column} title="NAME" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const email = row.getValue("email") as string;

      return (
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-muted-foreground flex items-center gap-1 text-sm">
            <Mail className="h-3 w-3" />
            {email}
          </span>
        </div>
      );
    },
    meta: {
      label: "Name",
      placeholder: "Search users...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "role",
    accessorKey: "role",
    header: ({ column }: { column: Column<UserType, unknown> }) => (
      <DataTableColumnHeader column={column} title="ROLE" />
    ),
    cell: ({ cell }) => {
      const role = cell.getValue<UserType["role"]>() as string;
      const variant = role === "superadmin" ? "destructive" : role === "admin" ? "default" : "secondary";

      return (
        <Badge variant={variant} className="capitalize">
          {role}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "roles",
      variant: "multiSelect",
      options: ROLE_OPTIONS,
    },
  },
  {
    accessorKey: "email",
    header: ({ column }: { column: Column<UserType, unknown> }) => (
      <DataTableColumnHeader column={column} title="EMAIL" />
    ),
    cell: ({ cell }) => {
      const email = cell.getValue<UserType["email"]>() as string;
      return (
        <div className="flex items-center gap-2">
          <Mail className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">{email}</span>
        </div>
      );
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "banned",
    header: "STATUS",
    cell: ({ cell }) => {
      const banned = cell.getValue<UserType["banned"]>();
      const Icon = banned ? XCircle : CheckCircle2;
      const statusColor = banned ? "text-red-600" : "text-green-600";
      const bgColor = banned ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200";

      return (
        <Badge variant="outline" className={`capitalize ${statusColor} ${bgColor}`}>
          <Icon className="mr-1 h-3 w-3" />
          {banned ? "BANNED" : "ACTIVE"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }: { column: Column<UserType, unknown> }) => (
      <DataTableColumnHeader column={column} title="CREATED AT" />
    ),
    cell: ({ cell }) => {
      const createdAt = cell.getValue<UserType["created_at"]>();
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
    cell: ({ row }) => <CellAction data={row.original} mode={mode} />,
  },
];

// Export a default columns function for backward compatibility
export const columns = createColumns("normal");
