"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { cn } from "@/lib/utils"
import { downloadPatientInvoice, type InvoiceSummary } from "@/src/patient/billing/api"
import { formatInvoiceIdDisplay } from "@/src/patient/billing/format-invoice-id"
import { usePatientInvoices } from "@/src/patient/queries/use-patient-invoices"

function InvoiceStatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase()
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        normalized === "paid"
          ? "border-primary/25 bg-primary/10 text-primary"
          : "border-border/70 bg-background text-foreground/80",
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
  const displayId = formatInvoiceIdDisplay(invoice.invoiceId)

  return (
    <div className="bg-muted/30 border-border/60 rounded-lg border p-3 md:px-4 md:py-3">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1.6fr)_9.5rem_6.5rem_5.5rem_auto] md:items-center md:gap-4">
        <div className="min-w-0 md:col-start-1">
          <p className="text-muted-foreground mb-1 text-xs font-medium md:sr-only">Invoice</p>
          <p
            className="font-mono text-sm leading-snug font-medium break-all md:truncate"
            title={invoice.invoiceId}
          >
            {displayId}
          </p>
        </div>
        <div className="min-w-0 md:col-start-2">
          <p className="text-muted-foreground mb-1 text-xs font-medium md:sr-only">Date</p>
          <p className="text-sm whitespace-nowrap">{invoice.issuedDate}</p>
        </div>
        <div className="min-w-0 md:col-start-3">
          <p className="text-muted-foreground mb-1 text-xs font-medium md:sr-only">Amount</p>
          <p className="text-sm font-medium whitespace-nowrap">{invoice.amountLabel}</p>
        </div>
        <div className="min-w-0 md:col-start-4">
          <p className="text-muted-foreground mb-1 text-xs font-medium md:sr-only">Status</p>
          <InvoiceStatusBadge status={invoice.status} />
        </div>
        <div className="md:col-start-5 md:justify-self-end">
          <Button
            size="sm"
            variant="outline"
            className="w-full md:w-auto"
            disabled={downloading}
            aria-label={`Download invoice ${invoice.invoiceId}`}
            onClick={onDownload}
          >
            {downloading ? "Downloading..." : "Download"}
          </Button>
        </div>
      </div>
    </div>
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
    <Card>
      <CardHeader className="pb-3">
        <p className="card-eyebrow">History</p>
        <CardTitle className="text-lg">Invoice History</CardTitle>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Downloads use the file your clinic issues (often PDF or plain text). The saved filename matches what the server sends.
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? <DashboardStateBlock variant="loading" message="Loading invoices..." /> : null}
          {error ? (
            <DashboardStateBlock variant="error" message={error} onRetry={() => void invoicesQuery.refetch()} />
          ) : null}
          {!isLoading && !error && invoices.length === 0 ? (
            <DashboardStateBlock variant="empty" message="No invoices yet." />
          ) : null}
          {!isLoading && !error && invoices.length > 0 ? (
            <div className="space-y-2">
              <div
                className="text-muted-foreground hidden px-4 text-xs font-medium md:grid md:grid-cols-[minmax(0,1.6fr)_9.5rem_6.5rem_5.5rem_auto] md:gap-4"
                aria-hidden
              >
                <span>Invoice</span>
                <span>Date</span>
                <span>Amount</span>
                <span>Status</span>
                <span className="text-right">Action</span>
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
          ) : null}
        </CardContent>
      </Card>
  )
}
