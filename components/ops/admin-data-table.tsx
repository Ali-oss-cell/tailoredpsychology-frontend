"use client"

import * as React from "react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type SortDirection = "asc" | "desc"

export type AdminDataTableColumn<TItem> = {
  key: string
  header: string
  sortable?: boolean
  className?: string
  renderCell: (item: TItem) => React.ReactNode
  sortValue?: (item: TItem) => string | number
}

type AdminDataTableProps<TItem> = {
  rows: TItem[]
  columns: AdminDataTableColumn<TItem>[]
  keyExtractor: (item: TItem) => string
  loading: boolean
  error: string | null
  emptyMessage: string
}

export function AdminDataTable<TItem>({
  rows,
  columns,
  keyExtractor,
  loading,
  error,
  emptyMessage,
}: AdminDataTableProps<TItem>) {
  const [sortColumnKey, setSortColumnKey] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc")

  const sortedRows = React.useMemo(() => {
    if (!sortColumnKey) {
      return rows
    }
    const column = columns.find((entry) => entry.key === sortColumnKey)
    if (!column?.sortValue) {
      return rows
    }
    return [...rows].sort((a, b) => {
      const aValue = column.sortValue!(a)
      const bValue = column.sortValue!(b)
      if (aValue === bValue) return 0
      const result = aValue > bValue ? 1 : -1
      return sortDirection === "asc" ? result : -result
    })
  }, [columns, rows, sortColumnKey, sortDirection])

  const handleSort = (column: AdminDataTableColumn<TItem>) => {
    if (!column.sortable || !column.sortValue) return
    if (sortColumnKey === column.key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
      return
    }
    setSortColumnKey(column.key)
    setSortDirection("asc")
  }

  if (loading) {
    return (
      <div className="overflow-x-auto rounded-md border border-border/70" aria-busy="true" aria-label="Loading data">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={cn("border-b border-border/70 px-3 py-2 text-left font-medium", column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border/40 last:border-b-0">
                {columns.map((column) => (
                  <td key={`${rowIndex}:${column.key}`} className={cn("px-3 py-2 align-top", column.className)}>
                    <Skeleton className="skeleton-shimmer h-4 w-full max-w-[12rem]" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  if (error) return <DashboardStateBlock variant="error" message={error} />
  if (rows.length === 0) return <DashboardStateBlock variant="empty" message={emptyMessage} />

  return (
    <div className="overflow-x-auto rounded-md border border-border/70">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-muted/50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={cn("border-b border-border/70 px-3 py-2 text-left font-medium", column.className)}>
                <button
                  type="button"
                  onClick={() => handleSort(column)}
                  disabled={!column.sortable}
                  className={cn("inline-flex items-center gap-1", !column.sortable && "cursor-default")}
                >
                  {column.header}
                  {sortColumnKey === column.key ? (sortDirection === "asc" ? "↑" : "↓") : null}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => (
            <tr key={keyExtractor(row)} className="border-b border-border/40 last:border-b-0">
              {columns.map((column) => (
                <td key={`${keyExtractor(row)}:${column.key}`} className={cn("px-3 py-2 align-top", column.className)}>
                  {column.renderCell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
