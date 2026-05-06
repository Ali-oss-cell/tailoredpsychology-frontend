"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/src/auth/current-user"

const USER_INVALIDATED = "clink:current-user-invalidated"

function initialsFromDisplayName(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  const first = parts[0]![0]
  const last = parts[parts.length - 1]![0]
  return `${first}${last}`.toUpperCase()
}

export function PatientHeaderProfile() {
  const pathname = usePathname()
  const [label, setLabel] = React.useState("…")
  const [showIncomplete, setShowIncomplete] = React.useState(false)

  const load = React.useCallback(async () => {
    try {
      const user = await getCurrentUser()
      setLabel(initialsFromDisplayName(user.displayName))
      setShowIncomplete(user.role === "patient" && user.accountSetupComplete === false)
    } catch {
      setLabel("?")
      setShowIncomplete(false)
    }
  }, [])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
    const onInvalidate = () => void load()
    window.addEventListener(USER_INVALIDATED, onInvalidate)
    return () => window.removeEventListener(USER_INVALIDATED, onInvalidate)
  }, [load, pathname])

  return (
    <span className="relative inline-flex shrink-0">
      <Link
        href="/patient/onboarding"
        className={cn(
          "bg-primary/20 text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
          "ring-offset-background hover:ring-primary/40 focus-visible:ring-ring outline-none transition hover:ring-2 focus-visible:ring-2 focus-visible:ring-offset-2",
        )}
        title={showIncomplete ? "Finish setting up your account" : "Account and get started"}
        aria-label={showIncomplete ? "Finish setting up your account" : "Account and get started"}
      >
        {label}
      </Link>
      {showIncomplete ? (
        <span
          className="ring-background absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-orange-400 ring-2"
          aria-hidden
        />
      ) : null}
    </span>
  )
}
