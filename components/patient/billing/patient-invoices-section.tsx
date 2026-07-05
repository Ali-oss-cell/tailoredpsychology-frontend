"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PortalListRow } from "@/components/shared/portal-list-row"
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
    <PortalListRow className="md:grid-cols-[minmax(0,1.4fr)_auto_auto_auto]">
      <div className="min-w-0">
        <p className="font-mono text-sm font-medium break-all md:truncate" title={invoice.invoiceId}>
          {displayId}
        </p>
      </div>
      <p className="text-sm whitespace-nowrap">{invoice.issuedDate}</p>
      <p className="text-sm font-medium whitespace-nowrap">{invoice.amountLabel}</p>
      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        <InvoiceStatusBadge status={invoice.status} />
        <Button
          size="sm"
          variant="outline"
          disabled={downloading}
          aria-label={`Download invoice ${invoice.invoiceId}`}
          onClick={onDownload}
        >
          {downloading ? "Downloading..." : "Download"}
        </Button>
      </div>
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
    <Card className="interactive-lift">
      <CardHeader className="pb-3">
        <p className="card-eyebrow">History</p>
        <CardTitle className="text-lg">Invoice history</CardTitle>
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
          <DashboardStateBlock variant="empty" message="No invoices yet." />
        ) : null}
        {!isLoading && !error && invoices.length > 0 ? (
          <div className="space-y-2">
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
