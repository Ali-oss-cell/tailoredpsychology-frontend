"use client"

import { useState } from "react"

import { Receipt } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { EmptyState } from "@/components/shared/empty-state"
import { PortalListRow } from "@/components/shared/portal-list-row"
import { cn } from "@/lib/utils"
import { downloadPatientInvoice, type InvoiceSummary } from "@/src/patient/billing/api"
import {
  formatInvoiceIssuedDate,
  formatInvoiceReferenceLabel,
} from "@/src/patient/billing/format-invoice-id"
import { usePatientInvoices } from "@/src/patient/queries/use-patient-invoices"

const INVOICE_ROW_GRID =
  "min-w-[34rem] grid-cols-[minmax(5.5rem,1fr)_5.5rem_4.5rem_minmax(0,1.15fr)_auto] items-center gap-x-4 gap-y-2"

function InvoiceStatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase()
  return (
    <span
      className={cn(
        "pill w-fit capitalize",
        normalized === "paid" && "pill-success",
        normalized === "pending" && "pill-warning",
        normalized === "overdue" && "pill-destructive font-semibold",
        normalized === "failed" && "pill-destructive font-semibold",
        !["paid", "pending", "overdue", "failed"].includes(normalized) && "pill-neutral",
      )}
    >
      {status}
    </span>
  )
}

function InvoiceRow({
  invoice,
  downloading,
  onDownload,
}: {
  invoice: InvoiceSummary
  downloading: boolean
  onDownload: () => void
}) {
  const dateLabel = formatInvoiceIssuedDate(invoice.issuedDate)
  const referenceLabel = formatInvoiceReferenceLabel(invoice.invoiceId, dateLabel)

  return (
    <PortalListRow className={INVOICE_ROW_GRID}>
      <p className="text-sm whitespace-nowrap">{dateLabel}</p>
      <p className="text-sm font-medium tabular-nums whitespace-nowrap">{invoice.amountLabel}</p>
      <InvoiceStatusBadge status={invoice.status} />
      <p className="text-muted-foreground min-w-0 truncate text-xs" title={invoice.invoiceId}>
        {referenceLabel}
      </p>
      <Button
        size="sm"
        variant="outline"
        className="shrink-0 justify-self-end"
        disabled={downloading}
        aria-label={`Download ${referenceLabel}`}
        onClick={onDownload}
      >
        {downloading ? "Downloading..." : "Download"}
      </Button>
    </PortalListRow>
  )
}

export function PatientInvoicesSection() {
  const invoicesQuery = usePatientInvoices()
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const invoices = invoicesQuery.data ?? []
  const isLoading = invoicesQuery.isLoading
  const error = invoicesQuery.isError ? "Could not load invoices." : downloadError

  async function handleDownload(invoiceId: string): Promise<void> {
    setDownloadingId(invoiceId)
    setDownloadError(null)
    try {
      const { blob, filename } = await downloadPatientInvoice(invoiceId)
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = filename
      anchor.click()
      URL.revokeObjectURL(url)
    } catch {
      setDownloadError("Download failed.")
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <Card className="dashboard-card interactive-lift">
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-lg">Invoice history</CardTitle>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Downloads use the file your clinic issues (often PDF or plain text). The saved filename matches what the
          server sends.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? <DashboardStateBlock variant="loading" message="Loading invoices..." /> : null}
        {error ? (
          <DashboardStateBlock variant="error" message={error} onRetry={() => void invoicesQuery.refetch()} />
        ) : null}
        {!isLoading && !error && invoices.length === 0 ? (
          <EmptyState
            icon={<Receipt size={28} weight="duotone" aria-hidden />}
            title="No invoices yet"
            description="When your clinic issues a bill, it will appear here for download."
          />
        ) : null}
        {!isLoading && !error && invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="space-y-2">
              <div
                className={cn(
                  "text-muted-foreground hidden px-4 text-xs font-medium tracking-wide uppercase md:grid",
                  INVOICE_ROW_GRID,
                )}
                aria-hidden
              >
                <span>Date</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Reference</span>
                <span className="sr-only">Actions</span>
              </div>
              {invoices.map((invoice) => (
                <InvoiceRow
                  key={invoice.invoiceId}
                  invoice={invoice}
                  downloading={downloadingId === invoice.invoiceId}
                  onDownload={() => void handleDownload(invoice.invoiceId)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
