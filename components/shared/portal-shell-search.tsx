"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { PortalSearchInput } from "@/components/shared/portal-form-field"

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
      <PortalSearchInput
        rounded="full"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        data-tutorial={dataTutorial}
        className="bg-muted/60 w-full max-w-none md:min-w-[16rem] lg:min-w-[22rem]"
      />
    </form>
  )
}
