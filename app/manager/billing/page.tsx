"use client"

import * as React from "react"

import { OpsShell } from "@/components/ops/ops-shell"
import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PortalMetricTile } from "@/components/shared/portal-list-row"
import { opsPagesContent } from "@/content/ops-pages"
import { getAdminOpsBilling, type AdminBillingSummary } from "@/src/admin/ops/api"

export default function ManagerBillingPage() {
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
    <OpsShell activeRoute="manager-billing">
      <OpsPortalPage
        eyebrow="Operations"
        title={opsPagesContent.managerBilling.title}
        description={opsPagesContent.managerBilling.description}
        tutorialId="manager.page.billing"
      >
        {loading ? <DashboardStateBlock variant="loading" message="Loading billing summary..." /> : null}
        {error ? <DashboardStateBlock variant="error" message={error} /> : null}
        {!loading && !error && summary ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <PortalMetricTile label="Revenue today" value={`$${summary.revenueToday.toFixed(2)}`} />
            <PortalMetricTile label="Revenue week" value={`$${summary.revenueWeek.toFixed(2)}`} />
            <PortalMetricTile label="Revenue month" value={`$${summary.revenueMonth.toFixed(2)}`} />
            <PortalMetricTile label="Failed payments" value={summary.failedPayments} />
            <PortalMetricTile label="Pending claims" value={summary.pendingClaims} />
          </div>
        ) : null}
      </OpsPortalPage>
    </OpsShell>
  )
}
