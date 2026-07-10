"use client"

import Link from "next/link"
import { ArrowRight, Receipt } from "@phosphor-icons/react/dist/ssr"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { EmptyState } from "@/components/shared/empty-state"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { InvoiceSummary } from "@/src/patient/billing/api"

type BillingSnapshotCardProps = {
  latestInvoice: InvoiceSummary | null
  unpaidCount: number
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}

function invoiceStatusChip(status: string): string {
  const normalized = status.trim().toLowerCase()
  if (normalized === "paid") return "bg-success/10 text-success border-success/25"
  if (normalized === "overdue" || normalized === "failed") return "bg-destructive/10 text-destructive border-destructive/25"
  return "bg-warning/10 text-warning border-warning/25"
}

/**
 * Billing at a glance: latest amount + status chip, unpaid alert when
 * relevant. Raw invoice IDs live on the invoices page, not here.
 */
export function BillingSnapshotCard({
  latestInvoice,
  unpaidCount,
  loading = false,
  error = null,
  onRetry,
}: BillingSnapshotCardProps) {
  return (
    <Card className="shadow-e1">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <p className="card-eyebrow">Billing</p>
        <Link
          href="/patient/invoices"
          className="text-primary inline-flex items-center gap-1 text-xs font-medium underline-offset-2 hover:underline"
        >
          View all <ArrowRight size={12} />
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3" aria-busy="true" aria-label="Loading billing snapshot">
            <Skeleton className="skeleton-shimmer h-8 w-28" />
            <Skeleton className="skeleton-shimmer h-4 w-40" />
          </div>
        ) : null}

        {!loading && error ? <DashboardStateBlock variant="error" message={error} onRetry={onRetry} /> : null}

        {!loading && !error && !latestInvoice ? (
          <EmptyState
            title="All settled"
            description="No invoices yet — you're all settled."
            icon={<Receipt size={22} weight="duotone" />}
          />
        ) : null}

        {!loading && !error && latestInvoice ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-heading text-2xl font-semibold tracking-tight tabular-nums">
                {latestInvoice.amountLabel}
              </p>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                  invoiceStatusChip(latestInvoice.status),
                )}
              >
                {latestInvoice.status}
              </span>
            </div>
            <p className="text-muted-foreground text-xs">Latest invoice · issued {latestInvoice.issuedDate}</p>
            {unpaidCount > 0 ? (
              <p className="text-warning border-warning/25 bg-warning/10 rounded-md border px-3 py-2 text-xs font-medium">
                {unpaidCount} invoice{unpaidCount === 1 ? "" : "s"} awaiting payment
              </p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
