"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { downloadPatientInvoice } from "@/src/patient/billing/api"
import { usePatientInvoices } from "@/src/patient/queries/use-patient-invoices"

type PatientInvoicesSectionProps = {
  title: string
  description: string
}

export function PatientInvoicesSection({ title, description }: PatientInvoicesSectionProps) {
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
    <section className="space-y-6" data-tutorial="patient.page.invoices">
      <header className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground max-w-2xl text-sm md:text-base">{description}</p>
      </header>

      <Card>
        <CardHeader className="pb-3">
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
              {invoices.map((invoice) => (
                <div
                  key={invoice.invoiceId}
                  className="bg-muted/30 border-border/60 grid grid-cols-2 items-center gap-3 rounded-lg border p-3 md:grid-cols-5"
                >
                  <span className="text-sm font-medium">{invoice.invoiceId}</span>
                  <span className="text-sm">{invoice.issuedDate}</span>
                  <span className="text-sm">{invoice.amountLabel}</span>
                  <span className="text-sm">{invoice.status}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="justify-self-start md:justify-self-end"
                    disabled={downloadingId === invoice.invoiceId}
                    aria-label={`Download invoice ${invoice.invoiceId}`}
                    onClick={() => void handleDownload(invoice.invoiceId)}
                  >
                    {downloadingId === invoice.invoiceId ? "Downloading..." : "Download"}
                  </Button>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  )
}
