import * as React from "react"

import { cn } from "@/lib/utils"

type PortalFormFieldProps = {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}

export function PortalFormField({
  id,
  label,
  hint,
  error,
  required,
  className,
  children,
}: PortalFormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? (
          <span className="text-destructive ml-0.5" aria-hidden>
            *
          </span>
        ) : null}
      </label>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
            id,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": describedBy,
          })
        : children}
      {hint ? (
        <p id={hintId} className="text-muted-foreground text-xs">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/** Shared input styling for portal forms (booking, account). */
export function portalInputClassName(hasError?: boolean) {
  return cn(
    "bg-background text-foreground border-border/70 focus-visible:ring-ring w-full rounded-xl border px-3.5 py-2.5 text-sm shadow-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-2",
    hasError && "border-destructive/60 focus-visible:ring-destructive/30",
  )
}
