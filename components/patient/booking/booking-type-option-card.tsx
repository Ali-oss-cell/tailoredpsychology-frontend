"use client"

import { CheckCircle } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

type BookingTypeOptionCardProps = {
  label: string
  description: string
  selected: boolean
  onSelect: () => void
}

export function BookingTypeOptionCard({
  label,
  description,
  selected,
  onSelect,
}: BookingTypeOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative flex h-full min-h-[7.5rem] flex-col rounded-xl border p-5 text-left transition-all duration-200",
        "hover:-translate-y-px hover:border-primary/45 hover:shadow-md",
        selected
          ? "border-primary bg-primary/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] ring-1 ring-primary/25"
          : "border-border/70 bg-card shadow-sm hover:bg-primary/[0.02]",
      )}
    >
      {selected ? (
        <span className="bg-primary text-primary-foreground absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium">
          <CheckCircle size={11} weight="bold" aria-hidden />
          Selected
        </span>
      ) : null}
      <p className={cn("pr-16 text-sm font-semibold", selected ? "text-foreground" : "text-foreground/90")}>
        {label}
      </p>
      <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{description}</p>
    </button>
  )
}
