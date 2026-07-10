"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { OpsShell, resolveManagerActiveRoute } from "@/components/ops/ops-shell"

export function ManagerShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activeRoute = React.useMemo(() => resolveManagerActiveRoute(pathname), [pathname])

  return <OpsShell activeRoute={activeRoute}>{children}</OpsShell>
}
