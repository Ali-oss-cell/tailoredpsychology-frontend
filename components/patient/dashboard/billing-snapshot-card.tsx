"use client"

import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { BillingSnapshotSkeleton } from "@/components/patient/dashboard/dashboard-skeletons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { InvoiceSummary } from "@/src/patient/billing/api"

type BillingSnapshotCardProps = {
  invoices: InvoiceSummary[]
  loading?: boolean
  error?: string | null
}

export function BillingSnapshotCard({ invoices, loading = false, error = null }: BillingSnapshotCardProps) {
  const latest = invoices[0]

  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">Billing</CardTitle>
        <Link
          href="/patient/invoices"
          className="text-primary inline-flex items-center gap-1 text-xs font-medium"
        >
          View all <ArrowRight size={12} />
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? <BillingSnapshotSkeleton /> : null}
        {!loading && error ? (
          <p className="text-destructive text-sm">{error}</p>
        ) : null}
        {!loading && !error && !latest ? (
          <p className="text-muted-foreground rounded-md border border-dashed border-border/60 bg-muted/20 px-3 py-4 text-sm">
            No invoices yet.
          </p>
        ) : null}
        {!loading && !error && latest ? (
          <div className="space-y-1">
            <p className="text-sm font-medium">{latest.amountLabel}</p>
            <p className="text-muted-foreground text-xs">
              {latest.issuedDate} · <span className="text-foreground/80">{latest.status}</span>
            </p>
            <p className="text-muted-foreground pt-1 text-xs">Invoice {latest.invoiceId}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
