"use client"

import * as React from "react"

import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { opsPagesContent } from "@/content/ops-pages"
import {
  getAdminOpsBilling,
  type AdminBillingSummary,
} from "@/src/admin/ops/api"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"

export default function AdminBillingPage() {
  const [summary, setSummary] = React.useState<AdminBillingSummary | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    void getAdminOpsBilling()
      .then((data) => {
        if (cancelled) return
        setSummary(data)
        setError(null)
      })
      .catch(() => {
        if (cancelled) return
        setError("Could not load billing summary.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <OpsPortalPage
      eyebrow="Administration"
      title={opsPagesContent.adminBilling.title}
      description={opsPagesContent.adminBilling.description}
    >
      {loading ? (
        <DashboardStateBlock variant="loading" message="Loading data..." />
      ) : null}
      {error ? <DashboardStateBlock variant="error" message={error} /> : null}
      {!loading && !error && summary ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            label="Revenue today"
            value={`$${summary.revenueToday.toFixed(2)}`}
          />
          <MetricCard
            label="Revenue week"
            value={`$${summary.revenueWeek.toFixed(2)}`}
          />
          <MetricCard
            label="Revenue month"
            value={`$${summary.revenueMonth.toFixed(2)}`}
          />
          <MetricCard
            label="Failed payments"
            value={`${summary.failedPayments}`}
          />
          <MetricCard
            label="Pending claims"
            value={`${summary.pendingClaims}`}
          />
        </div>
      ) : null}
    </OpsPortalPage>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}
