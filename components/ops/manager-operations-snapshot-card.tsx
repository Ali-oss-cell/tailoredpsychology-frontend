"use client"

import Link from "next/link"
import * as React from "react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PortalListRow } from "@/components/shared/portal-list-row"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getAdminOpsAppointments,
  getAdminOpsBilling,
  getAdminOpsStaff,
} from "@/src/admin/ops/api"
import { opsPagesContent } from "@/content/ops-pages"

type SnapshotRow = {
  metric: string
  value: string
  status: string
  href: string
}

function isToday(iso: string): boolean {
  const date = new Date(iso)
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

export function ManagerOperationsSnapshotCard() {
  const [rows, setRows] = React.useState<SnapshotRow[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const load = React.useCallback(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    void Promise.all([getAdminOpsStaff(), getAdminOpsAppointments(), getAdminOpsBilling()])
      .then(([staff, appointments, billing]) => {
        if (cancelled) return

        const activeStaff = staff.filter((member) => member.status.toLowerCase() === "active").length
        const appointmentsToday = appointments.filter((item) => isToday(item.scheduledStartAt)).length
        const billingQueue = billing.failedPayments + billing.pendingClaims

        setRows([
          {
            metric: "Active staff",
            value: String(activeStaff),
            status: activeStaff > 0 ? "Stable" : "Empty",
            href: "/manager/staff",
          },
          {
            metric: "Appointments today",
            value: String(appointmentsToday),
            status: appointmentsToday > 0 ? "On track" : "None scheduled",
            href: "/manager/appointments",
          },
          {
            metric: "Billing queue",
            value: String(billingQueue),
            status: billingQueue > 0 ? "Needs review" : "Clear",
            href: "/manager/billing",
          },
        ])
      })
      .catch(() => {
        if (!cancelled) setError("We couldn't load today's operations. Try again.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  return (
    <Card className="dashboard-card interactive-lift">
      <CardHeader className="pb-3">
        <p className="card-eyebrow">Operations</p>
        <CardTitle className="text-lg">{opsPagesContent.managerDashboard.cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? <DashboardStateBlock variant="loading" message="Loading operations..." /> : null}
        {!loading && error ? <DashboardStateBlock variant="error" message={error} onRetry={load} /> : null}
        {!loading && !error && rows.length === 0 ? (
          <DashboardStateBlock variant="empty" message="No operations data yet." />
        ) : null}
        {!loading && !error
          ? rows.map((row) => (
              <PortalListRow key={row.metric} className="grid-cols-1 md:grid-cols-[1.4fr_0.6fr_0.8fr_auto] md:items-center">
                <p className="text-sm font-medium">{row.metric}</p>
                <p className="text-sm tabular-nums">{row.value}</p>
                <p className="text-muted-foreground text-sm">{row.status}</p>
                <Button asChild variant="outline" size="sm" className="w-fit">
                  <Link href={row.href}>Open</Link>
                </Button>
              </PortalListRow>
            ))
          : null}
      </CardContent>
    </Card>
  )
}
