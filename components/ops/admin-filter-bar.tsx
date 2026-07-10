"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { PortalSearchInput, PortalSelect } from "@/components/shared/portal-form-field"

type FilterOption = {
  label: string
  value: string
}

type FilterSelect = {
  key: string
  label: string
  value: string
  options: FilterOption[]
}

type AdminFilterBarProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  selects?: FilterSelect[]
  onSelectChange?: (key: string, value: string) => void
  onClear?: () => void
  resultCount?: number
  resultLabel?: string
}

export function AdminFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  selects = [],
  onSelectChange,
  onClear,
  resultCount,
  resultLabel = "results",
}: AdminFilterBarProps) {
  const activeChips = React.useMemo(() => {
    const chips: { key: string; label: string }[] = []
    if (searchValue.trim()) {
      chips.push({ key: "search", label: `Search: ${searchValue.trim()}` })
    }
    for (const select of selects) {
      const defaultOption = select.options[0]
      if (select.value && defaultOption && select.value !== defaultOption.value) {
        const match = select.options.find((opt) => opt.value === select.value)
        chips.push({ key: select.key, label: `${select.label}: ${match?.label ?? select.value}` })
      }
    }
    return chips
  }, [searchValue, selects])

  return (
    <div className="space-y-2">
    <div className="bg-background/95 lg:sticky lg:top-0 lg:z-20 flex flex-wrap items-end gap-3 rounded-md border border-border/70 p-3 backdrop-blur-sm">
      <label className="flex min-w-64 flex-1 flex-col gap-1 text-xs">
        <span className="text-muted-foreground">Search</span>
        <PortalSearchInput
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
        />
      </label>

      {selects.map((select) => (
        <label key={select.key} className="flex min-w-40 flex-col gap-1 text-xs">
          <span className="text-muted-foreground">{select.label}</span>
          <PortalSelect
            value={select.value}
            onChange={(event) => onSelectChange?.(select.key, event.target.value)}
          >
            {select.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </PortalSelect>
        </label>
      ))}

      {onClear ? (
        <button type="button" onClick={onClear} className="rounded border border-border px-3 py-1.5 text-sm hover:bg-muted">
          Clear
        </button>
      ) : null}
    </div>
    {typeof resultCount === "number" ? (
      <p className="text-muted-foreground px-1 text-xs">
        {resultCount} {resultLabel}
      </p>
    ) : null}
    {activeChips.length > 0 ? (
      <div className="flex flex-wrap items-center gap-2 px-1">
        <span className="text-muted-foreground text-xs font-medium">Active filters</span>
        {activeChips.map((chip) => (
          <Badge key={chip.key} variant="secondary" className="rounded-full text-xs font-normal">
            {chip.label}
          </Badge>
        ))}
      </div>
    ) : null}
    </div>
  )
}
