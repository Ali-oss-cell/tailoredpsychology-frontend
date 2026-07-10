"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { OpsShell, resolveAdminActiveRoute } from "@/components/ops/ops-shell"

export function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activeRoute = React.useMemo(() => resolveAdminActiveRoute(pathname), [pathname])

  return <OpsShell activeRoute={activeRoute}>{children}</OpsShell>
}
