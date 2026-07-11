"use client"

import { useCallback, useEffect, useState } from "react"
import { FileText, PencilSimple } from "@phosphor-icons/react"

import { CardSectionHeading } from "@/components/shared/card-section-heading"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { EmptyState } from "@/components/shared/empty-state"
import { PortalFormField, PortalTextarea } from "@/components/shared/portal-form-field"
import { PortalListRow } from "@/components/shared/portal-list-row"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import {
  formatPrivacyRequestDue,
  formatPrivacyRequestStatus,
  patientPrivacyRequestsContent,
} from "@/content/patient-privacy-requests"
import { cn } from "@/lib/utils"
import { createPatientDataRequest, getMyPatientDataRequests, type PatientDataRequest } from "@/src/privacy-requests/api"
import { toast } from "@/src/lib/toast"

export function PatientDataRequestsSection() {
  const [rows, setRows] = useState<PatientDataRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingRequestType, setPendingRequestType] = useState<"access" | "correction" | null>(null)
  const [requestDetails, setRequestDetails] = useState("")
  const [detailsError, setDetailsError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const copy = patientPrivacyRequestsContent

  const loadRequests = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setRows(await getMyPatientDataRequests())
    } catch {
      setError(copy.list.error)
    } finally {
      setLoading(false)
    }
  }, [copy.list.error])

  useEffect(() => {
    void loadRequests()
  }, [loadRequests])

  const createRequest = async () => {
    if (!pendingRequestType) return
    if (!requestDetails.trim()) {
      setDetailsError("Please describe your request before sending.")
      return
    }
    try {
      setSubmitting(true)
      const created = await createPatientDataRequest({
        requestType: pendingRequestType,
        details: requestDetails,
        requestedCorrection: pendingRequestType === "correction" ? "Update patient profile record." : undefined,
      })
      setRows((prev) => [created, ...prev])
      setError(null)
      setPendingRequestType(null)
      setRequestDetails("")
      setDetailsError(null)
      toast.success("Your request has been submitted.")
    } catch {
      setError(copy.list.submitError)
      toast.error(copy.list.submitError)
    } finally {
      setSubmitting(false)
    }
  }

  const dialogCopy =
    pendingRequestType === "correction" ? copy.dialog.correction : copy.dialog.access

  return (
    <>
      <Card className="dashboard-card interactive-lift">
        <CardHeader className="pb-2">
          <CardSectionHeading>New request</CardSectionHeading>
          <CardTitle className="text-lg">{copy.newRequest.title}</CardTitle>
          <p className="text-muted-foreground text-sm leading-relaxed">{copy.newRequest.intro}</p>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            aria-label={copy.newRequest.access.label}
            onClick={() => setPendingRequestType("access")}
            className={cn(
              "hover:border-primary/40 hover:bg-primary/[0.03] rounded-xl border border-border/70 bg-background p-4 text-left transition-colors",
            )}
          >
            <span className="bg-primary/10 text-primary mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg">
              <FileText size={18} weight="duotone" aria-hidden />
            </span>
            <p className="text-sm font-semibold">{copy.newRequest.access.label}</p>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{copy.newRequest.access.hint}</p>
          </button>
          <button
            type="button"
            aria-label={copy.newRequest.correction.label}
            onClick={() => setPendingRequestType("correction")}
            className={cn(
              "hover:border-primary/40 hover:bg-primary/[0.03] rounded-xl border border-border/70 bg-background p-4 text-left transition-colors",
            )}
          >
            <span className="bg-primary/10 text-primary mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg">
              <PencilSimple size={18} weight="duotone" aria-hidden />
            </span>
            <p className="text-sm font-semibold">{copy.newRequest.correction.label}</p>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{copy.newRequest.correction.hint}</p>
          </button>
        </CardContent>
      </Card>

      <Card className="dashboard-card interactive-lift">
        <CardHeader className="pb-3">
          <CardSectionHeading>History</CardSectionHeading>
          <CardTitle className="text-lg">{copy.list.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? <DashboardStateBlock variant="loading" message={copy.list.loading} /> : null}
          {!loading && error ? (
            <DashboardStateBlock variant="error" message={error} onRetry={() => void loadRequests()} />
          ) : null}
          {!loading && !error && rows.length === 0 ? (
            <EmptyState
              icon={<FileText size={28} weight="duotone" aria-hidden />}
              title="No requests yet"
              description={copy.list.empty}
            />
          ) : null}
          {rows.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="min-w-[28rem] space-y-3">
                {rows.map((row) => (
                  <PortalListRow key={row.requestId}>
                    <div>
                      <p className="font-medium">{copy.requestTypeLabel[row.requestType]}</p>
                      <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{row.details}</p>
                      <p className="text-muted-foreground mt-2 text-xs">
                        {formatPrivacyRequestStatus(row.status)} · {formatPrivacyRequestDue(row.slaDueAt)}
                      </p>
                    </div>
                  </PortalListRow>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={pendingRequestType !== null}
        title={dialogCopy.title}
        description={dialogCopy.description}
        confirmLabel={copy.dialog.confirmLabel}
        isLoading={submitting}
        onCancel={() => {
          setPendingRequestType(null)
          setRequestDetails("")
          setDetailsError(null)
        }}
        onConfirm={() => void createRequest()}
      >
        <PortalFormField
          id="data-request-details"
          label={dialogCopy.fieldLabel}
          error={detailsError ?? undefined}
          required
        >
          <PortalTextarea
            value={requestDetails}
            hasError={Boolean(detailsError)}
            rows={4}
            placeholder={dialogCopy.placeholder}
            onChange={(event) => {
              setRequestDetails(event.target.value)
              if (detailsError) setDetailsError(null)
            }}
          />
        </PortalFormField>
      </ConfirmDialog>
    </>
  )
}
