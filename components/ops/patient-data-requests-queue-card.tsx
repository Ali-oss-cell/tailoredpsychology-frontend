"use client"

import * as React from "react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { EmptyState } from "@/components/shared/empty-state"
import { ClientPaginationBar, useClientPagination } from "@/components/shared/client-pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateTimeAu } from "@/src/lib/format-au"
import { getOpsPatientDataRequests, submitOpsPatientDataRequestAction, type PatientDataRequest } from "@/src/privacy-requests/api"
import { toast } from "@/src/lib/toast"

const ACTIONS: Array<"assign" | "start_review" | "fulfill" | "reject"> = ["assign", "start_review", "fulfill", "reject"]

export function PatientDataRequestsQueueCard({ title = "Patient data requests queue" }: { title?: string }) {
  const [rows, setRows] = React.useState<PatientDataRequest[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [actingId, setActingId] = React.useState<string | null>(null)

  const loadRows = React.useCallback(() => {
    let cancelled = false
    void (async () => {
      try {
        const next = await getOpsPatientDataRequests()
        if (!cancelled) {
          setRows(next)
          setError(null)
        }
      } catch {
        if (!cancelled) setError("We couldn't load requests. Try again.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  React.useEffect(() => {
    setLoading(true)
    loadRows()
  }, [loadRows])

  const retryLoad = () => {
    setLoading(true)
    setError(null)
    loadRows()
  }

  const runAction = async (requestId: string, action: "assign" | "start_review" | "fulfill" | "reject") => {
    try {
      setActingId(requestId)
      const updated = await submitOpsPatientDataRequestAction(requestId, {
        action,
        notes: action === "fulfill" ? "Request fulfilled by governance team." : undefined,
        reason: action === "reject" ? "Insufficient details provided." : undefined,
      })
      setRows((prev) => prev.map((item) => (item.requestId === updated.requestId ? updated : item)))
      setError(null)
      toast.success("Request updated.")
    } catch {
      const message = "Action failed. Please retry."
      setError(message)
      toast.error(message)
    } finally {
      setActingId(null)
    }
  }

  const pagination = useClientPagination(rows)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
        {!loading && error ? <DashboardStateBlock variant="error" message={error} onRetry={retryLoad} /> : null}
        {!loading && !error && rows.length === 0 ? (
          <EmptyState title="No requests in queue." description="Patient access and correction requests will appear here." />
        ) : null}
        {pagination.pageItems.map((row) => (
          <article key={row.requestId} className="space-y-2 rounded-md border border-border/70 p-3 text-xs">
            <div className="flex items-center justify-between">
              <p className="font-medium">{row.requestId}</p>
              <p className="text-muted-foreground">{row.status}</p>
            </div>
            <p className="text-muted-foreground">
              patient: {row.patientId} • type: {row.requestType} • due: {formatDateTimeAu(row.slaDueAt)}
            </p>
            <p>{row.details}</p>
            <div className="flex flex-wrap gap-2">
              {ACTIONS.map((action) => (
                <button
                  key={action}
                  type="button"
                  disabled={actingId === row.requestId}
                  className="rounded border border-border px-2 py-1 hover:bg-muted disabled:opacity-60"
                  onClick={() => void runAction(row.requestId, action)}
                >
                  {action}
                </button>
              ))}
            </div>
          </article>
        ))}
        <ClientPaginationBar
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          canGoPrev={pagination.canGoPrev}
          canGoNext={pagination.canGoNext}
          onPrev={() => pagination.setPage((p) => Math.max(1, p - 1))}
          onNext={() => pagination.setPage((p) => Math.min(pagination.totalPages, p + 1))}
        />
      </CardContent>
    </Card>
  )
}
