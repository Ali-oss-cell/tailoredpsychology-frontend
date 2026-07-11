"use client"

import { ArrowUp } from "@phosphor-icons/react"

export function PublicFooterBackToTop() {
  return (
    <button
      type="button"
      className="text-muted-foreground hover:text-foreground inline-flex size-9 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <ArrowUp size={16} aria-hidden />
    </button>
  )
}
