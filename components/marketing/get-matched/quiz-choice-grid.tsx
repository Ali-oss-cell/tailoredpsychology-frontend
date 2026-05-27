"use client"

import { cn } from "@/lib/utils"

type QuizChoiceGridProps<T extends string> = {
  options: Array<{ value: T; label: string; hint?: string }>
  value: T | T[]
  multiple?: boolean
  onChange: (value: T | T[]) => void
}

export function QuizChoiceGrid<T extends string>({
  options,
  value,
  multiple = false,
  onChange,
}: QuizChoiceGridProps<T>) {
  const selectedSet = new Set(Array.isArray(value) ? value : value ? [value] : [])

  function toggle(optionValue: T) {
    if (!multiple) {
      onChange(optionValue)
      return
    }
    const current = Array.isArray(value) ? [...value] : []
    const next = current.includes(optionValue)
      ? current.filter((v) => v !== optionValue)
      : [...current, optionValue]
    onChange(next)
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const active = selectedSet.has(option.value)
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            className={cn(
              "rounded-xl border px-4 py-3 text-left text-sm transition-colors",
              active
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border/70 bg-background hover:border-primary/40",
            )}
          >
            <span className="font-medium">{option.label}</span>
            {option.hint ? <p className="text-muted-foreground mt-1 text-xs">{option.hint}</p> : null}
          </button>
        )
      })}
    </div>
  )
}
