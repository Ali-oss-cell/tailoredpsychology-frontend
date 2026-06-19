"use client"

import { useEffect, useState } from "react"

import { PatientPageHeader } from "@/components/patient/patient-page-header"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { createPatientDataRequest, getMyPatientDataRequests, type PatientDataRequest } from "@/src/privacy-requests/api"

export default function PatientDataRequestsPage() {
  const [rows, setRows] = useState<PatientDataRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingRequestType, setPendingRequestType] = useState<"access" | "correction" | null>(null)
  const [requestDetails, setRequestDetails] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    void (async () => {
      try {
        setRows(await getMyPatientDataRequests())
      } catch {
        setError("We couldn't load requests. Try again.")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const createRequest = async () => {
    if (!pendingRequestType || !requestDetails.trim()) return
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
    } catch {
      setError("Failed to create request. Please retry.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="space-y-6" data-tutorial="patient.page.privacy-requests">
        <PatientPageHeader
          title="Data Access and Correction Requests"
          description="Submit and track privacy requests for record access or correction."
        />
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">New request</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={() => setPendingRequestType("access")}>Request access</Button>
            <Button variant="outline" onClick={() => setPendingRequestType("correction")}>
              Request correction
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">My requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
            {!loading && error ? <DashboardStateBlock variant="error" message={error} /> : null}
            {!loading && !error && rows.length === 0 ? <DashboardStateBlock variant="empty" message="No requests yet." /> : null}
            {rows.map((row) => (
              <div key={row.requestId} className="rounded-md border border-border/70 bg-muted/40 p-3 text-sm">
                <p className="font-medium">
                  {row.requestId} • {row.requestType}
                </p>
                <p className="text-muted-foreground">
                  status: {row.status} • due: {new Date(row.slaDueAt).toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <ConfirmDialog
          open={pendingRequestType !== null}
          title={pendingRequestType === "correction" ? "Submit correction request" : "Submit access request"}
          description="Provide details so the governance team can process your request quickly."
          confirmLabel="Submit request"
          isLoading={submitting}
          onCancel={() => {
            setPendingRequestType(null)
            setRequestDetails("")
          }}
          onConfirm={() => void createRequest()}
        >
          <label className="block text-xs">
            <span className="text-muted-foreground">Request details</span>
            <textarea
              value={requestDetails}
              onChange={(event) => setRequestDetails(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded border border-border px-2 py-1 text-sm"
              placeholder="Describe what records you need or what should be corrected."
            />
          </label>
        </ConfirmDialog>
      </section>
  )
}
