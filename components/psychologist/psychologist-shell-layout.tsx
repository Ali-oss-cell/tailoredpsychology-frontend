"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { PsychologistShell } from "@/components/psychologist/psychologist-shell"
import { resolvePsychologistNavKey } from "@/src/routes/nav-utils"

export function PsychologistShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activeRoute = React.useMemo(() => resolvePsychologistNavKey(pathname), [pathname])

  return <PsychologistShell activeRoute={activeRoute}>{children}</PsychologistShell>
}
