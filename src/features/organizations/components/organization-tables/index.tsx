/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { parseAsInteger, useQueryState } from "nuqs";

import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableWithActionBar } from "@/components/data-table/data-table-with-action-bar";
import { useDataTable } from "@/hooks/use-data-table";

interface OrganizationTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}

function copyDataExcluded(data: any[]) {
  return data.map(({ logo, ...rest }) => rest);
}

export function OrganizationTable<TData, TValue>({
  data,
  totalItems,
  columns,
}: OrganizationTableParams<TData, TValue>) {
  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false, // Setting to false triggers a network request with the updated querystring.
    debounceMs: 500,
  });

  return (
    <DataTableWithActionBar table={table}>
      <DataTableToolbar data={copyDataExcluded(data)} table={table} />
    </DataTableWithActionBar>
  );
}
