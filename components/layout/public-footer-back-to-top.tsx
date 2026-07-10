"use client"

import { ArrowUp } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"

export function PublicFooterBackToTop() {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="min-h-11 rounded-xl"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp size={16} aria-hidden />
      Back to Top
    </Button>
  )
}
