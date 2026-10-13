/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react";
import { useRouter } from "next/navigation";



interface CustomTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  path?: string
}

function CustomTable<TData>({ data, columns, path }: CustomTableProps<TData>) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    getRowId: (row: any) => row.id,
  })

  const redirectTo = (data: any) => {
    setSelectedId(data?._id)
    if (path) {
      router.push(`${path}/${data?._id}`)
    }
  }

  return (
    <div className="w-full">
      <div className="rounded-md">
        <Table className="border-separate border-spacing-y-0">
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className=""
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => redirectTo(row.original)}
                  data-state={row.id === selectedId ? "selected" : "unselected"}
                  className="px-2 odd:bg-[#F6F6F6] hover:bg-gray-200 cursor-pointer data-[state=selected]:bg-gray-300 transition-colors duration-300"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3 xl:py-4"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>

              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-20 text-center py-16"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default CustomTable
