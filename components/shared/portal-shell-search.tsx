"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

type PortalShellSearchProps = {
  /** Destination route for submitted queries, e.g. `/admin/patients` or `/patient/appointments`. */
  targetHref?: string
  /** @deprecated Use `targetHref`. Kept for existing ops/psych shells. */
  patientsHref?: string
  placeholder?: string
  className?: string
  "data-tutorial"?: string
}

export function PortalShellSearch({
  targetHref,
  patientsHref,
  placeholder = "Search patients by name or ID…",
  className,
  "data-tutorial": dataTutorial,
}: PortalShellSearchProps) {
  const router = useRouter()
  const [value, setValue] = React.useState("")
  const href = targetHref ?? patientsHref ?? "/"

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = value.trim()
    if (!query) return
    router.push(`${href}?q=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={handleSubmit} className={cn("hidden min-w-0 md:block", className)}>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        data-tutorial={dataTutorial}
        className="bg-muted/60 border-border focus-visible:ring-ring w-80 max-w-full rounded-full border px-4 py-2 text-sm outline-none focus-visible:ring-2 lg:w-96"
      />
    </form>
  )
}
