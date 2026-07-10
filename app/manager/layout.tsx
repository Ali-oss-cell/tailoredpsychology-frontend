import type * as React from "react"

import { ManagerShellLayout } from "@/components/ops/manager-shell-layout"

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <ManagerShellLayout>{children}</ManagerShellLayout>
}
