"use client"

import * as React from "react"

import { ClientPaginationBar, CLIENT_PAGE_SIZE, useClientPagination } from "@/components/shared/client-pagination"
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
  pageSize?: number
}

function ariaSortValue(
  columnKey: string,
  sortColumnKey: string | null,
  sortDirection: SortDirection,
): "ascending" | "descending" | "none" {
  if (sortColumnKey !== columnKey) return "none"
  return sortDirection === "asc" ? "ascending" : "descending"
}

export function AdminDataTable<TItem>({
  rows,
  columns,
  keyExtractor,
  loading,
  error,
  emptyMessage,
  pageSize = CLIENT_PAGE_SIZE,
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
      return sortDirection === "asc" ? result : -1 * result
    })
  }, [columns, rows, sortColumnKey, sortDirection])

  const pagination = useClientPagination(sortedRows, pageSize)

  const handleSort = (column: AdminDataTableColumn<TItem>) => {
    if (!column.sortable || !column.sortValue) return
    if (sortColumnKey === column.key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
      return
    }
    setSortColumnKey(column.key)
    setSortDirection("asc")
  }

  const handleSortKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    column: AdminDataTableColumn<TItem>,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleSort(column)
    }
  }

  if (loading) {
    return (
      <div className="overflow-x-auto rounded-md border border-border/70" aria-busy="true" aria-label="Loading data">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn("border-b border-border/70 px-3 py-2 text-left font-medium", column.className)}
                >
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
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-md border border-border/70">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    column.sortable ? ariaSortValue(column.key, sortColumnKey, sortDirection) : undefined
                  }
                  className={cn("border-b border-border/70 px-3 py-2 text-left font-medium", column.className)}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(column)}
                      onKeyDown={(event) => handleSortKeyDown(event, column)}
                      className="inline-flex items-center gap-1 rounded-sm focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {column.header}
                      {sortColumnKey === column.key ? (sortDirection === "asc" ? "↑" : "↓") : null}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagination.pageItems.map((row) => (
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
      <ClientPaginationBar
        page={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
        canGoPrev={pagination.canGoPrev}
        canGoNext={pagination.canGoNext}
        onPrev={() => pagination.setPage((p) => Math.max(1, p - 1))}
        onNext={() => pagination.setPage((p) => Math.min(pagination.totalPages, p + 1))}
      />
    </div>
  )
}
