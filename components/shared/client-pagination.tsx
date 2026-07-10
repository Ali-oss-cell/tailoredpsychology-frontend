"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const CLIENT_PAGE_SIZE = 25

export function useClientPagination<TItem>(items: TItem[], pageSize = CLIENT_PAGE_SIZE) {
  const [page, setPage] = React.useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  React.useEffect(() => {
    setPage((current) => Math.min(current, totalPages))
  }, [items.length, totalPages])

  const pageItems = React.useMemo(() => {
    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, page, pageSize])

  return {
    page,
    setPage,
    pageItems,
    totalPages,
    pageSize,
    totalItems: items.length,
    canGoPrev: page > 1,
    canGoNext: page < totalPages,
  }
}

type ClientPaginationBarProps = {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  canGoPrev: boolean
  canGoNext: boolean
  onPrev: () => void
  onNext: () => void
  className?: string
}

export function ClientPaginationBar({
  page,
  totalPages,
  totalItems,
  pageSize,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  className,
}: ClientPaginationBarProps) {
  if (totalItems <= pageSize) {
    return null
  }

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <div
      className={cn("flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3 text-sm", className)}
      aria-label="Table pagination"
    >
      <p className="text-muted-foreground text-xs">
        Showing {start}–{end} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <Button type="button" size="sm" variant="outline" disabled={!canGoPrev} onClick={onPrev}>
          Previous
        </Button>
        <span className="text-muted-foreground text-xs" aria-live="polite">
          Page {page} of {totalPages}
        </span>
        <Button type="button" size="sm" variant="outline" disabled={!canGoNext} onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  )
}
