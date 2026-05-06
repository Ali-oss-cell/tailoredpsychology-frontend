"use client"

import * as React from "react"
import { WarningCircle, Info, CheckCircle } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  children?: React.ReactNode
  variant?: "neutral" | "danger" | "success"
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  children,
  variant = "neutral",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const panelRef = React.useRef<HTMLDivElement>(null)
  const confirmButtonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (!open) return
    confirmButtonRef.current?.focus()
  }, [open])

  React.useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "Escape") {
      event.preventDefault()
      onCancel()
      return
    }
    if (event.key !== "Tab" || !panelRef.current) return
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement
    if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    } else if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    }
  }

  const icon =
    variant === "danger" ? (
      <WarningCircle size={18} className="text-red-500" />
    ) : variant === "success" ? (
      <CheckCircle size={18} className="text-green-500" />
    ) : (
      <Info size={18} className="text-primary" />
    )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 animate-in fade-in-0 duration-150"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel()
        }
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        onKeyDown={onKeyDown}
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-border bg-background p-4 shadow-xl animate-in zoom-in-95 slide-in-from-bottom-2 duration-200"
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-base font-semibold">{title}</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {children ? <div className="mt-3">{children}</div> : null}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded border border-border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "rounded px-3 py-1.5 text-sm text-primary-foreground disabled:opacity-60",
              variant === "danger" ? "bg-red-600 hover:bg-red-700" : variant === "success" ? "bg-green-600 hover:bg-green-700" : "bg-primary",
            )}
          >
            {isLoading ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
