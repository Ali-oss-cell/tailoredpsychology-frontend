import type * as React from "react"

import { AdminShellLayout } from "@/components/ops/admin-shell-layout"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShellLayout>{children}</AdminShellLayout>
}
