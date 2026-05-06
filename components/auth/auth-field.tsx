import type * as React from "react"

import { cn } from "@/lib/utils"

type AuthFieldProps = {
  id: string
  label: string
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  hint?: string
  rightLabel?: React.ReactNode
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "type" | "placeholder">

export function AuthField({
  id,
  label,
  type = "text",
  placeholder,
  hint,
  rightLabel,
  ...inputProps
}: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {rightLabel}
      </div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={cn(
          "bg-background text-foreground border-border focus-visible:ring-ring w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors",
          "focus-visible:ring-2",
        )}
        {...inputProps}
      />
      {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
    </div>
  )
}
