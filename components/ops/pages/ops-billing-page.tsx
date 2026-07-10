"use client"

import { OpsPortalPage } from "@/components/ops/ops-portal-page"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PortalMetricTile } from "@/components/shared/portal-list-row"
import { opsPagesContent } from "@/content/ops-pages"
import { useOpsBilling } from "@/src/admin/ops/queries/use-ops-billing"

export function OpsBillingPage({ role }: { role: "manager" | "admin" }) {
  const { data: summary, isLoading, error } = useOpsBilling()
  const copy = role === "manager" ? opsPagesContent.managerBilling : opsPagesContent.adminBilling

  return (
    <OpsPortalPage
      eyebrow={role === "manager" ? "Operations" : "Administration"}
      title={copy.title}
      description={copy.description}
      tutorialId={role === "manager" ? "manager.page.billing" : undefined}
    >
      {isLoading ? <DashboardStateBlock variant="loading" message="Loading billing summary..." /> : null}
      {error ? <DashboardStateBlock variant="error" message="Could not load billing summary." /> : null}
      {!isLoading && !error && summary ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <PortalMetricTile label="Revenue today" value={`$${summary.revenueToday.toFixed(2)}`} />
          <PortalMetricTile label="Revenue week" value={`$${summary.revenueWeek.toFixed(2)}`} />
          <PortalMetricTile label="Revenue month" value={`$${summary.revenueMonth.toFixed(2)}`} />
          <PortalMetricTile label="Failed payments" value={summary.failedPayments} />
          <PortalMetricTile label="Pending claims" value={summary.pendingClaims} />
        </div>
      ) : null}
    </OpsPortalPage>
  )
}
