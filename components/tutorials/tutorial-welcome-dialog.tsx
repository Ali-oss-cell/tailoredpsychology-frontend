"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type TutorialWelcomeDialogProps = {
  open: boolean
  title: string
  description: string
  onStartTour: () => void
  onSnooze: () => void
  onDismissForever: () => void
}

export function TutorialWelcomeDialog({
  open,
  title,
  description,
  onStartTour,
  onSnooze,
  onDismissForever,
}: TutorialWelcomeDialogProps) {
  const panelRef = React.useRef<HTMLDivElement>(null)
  const primaryRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (!open) return
    primaryRef.current?.focus()
  }, [open])

  React.useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "Escape") {
      event.preventDefault()
      onSnooze()
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

  if (!open) return null

  return (
    <div
      className="animate-in fade-in-0 fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4 duration-150"
      data-testid="tutorial-welcome-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onSnooze()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-welcome-title"
        aria-describedby="tutorial-welcome-desc"
        onKeyDown={onKeyDown}
        onMouseDown={(event) => event.stopPropagation()}
        className={cn(
          "bg-background border-border animate-in zoom-in-95 slide-in-from-bottom-2 w-full max-w-md rounded-xl border p-5 shadow-xl duration-200",
        )}
      >
        <h2 id="tutorial-welcome-title" className="font-heading text-lg font-semibold tracking-tight">
          {title}
        </h2>
        <p id="tutorial-welcome-desc" className="text-muted-foreground mt-2 text-sm leading-relaxed">
          {description}
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <Button type="button" variant="outline" className="order-3 sm:order-1" onClick={onDismissForever}>
            Don&apos;t show again
          </Button>
          <Button type="button" variant="secondary" className="order-2 sm:order-2" onClick={onSnooze}>
            Maybe later
          </Button>
          <Button ref={primaryRef} type="button" className="order-1 sm:order-3" onClick={onStartTour}>
            Start guided tour
          </Button>
        </div>
      </div>
    </div>
  )
}
