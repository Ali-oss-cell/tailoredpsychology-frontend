"use client"

import * as React from "react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { getReferralQueue, submitReferralAction, type ReferralQueueItem } from "@/src/ops/referrals/api"

type ReferralQueueCardProps = {
  title?: string
}

type OwnerFilter = "all" | "unreviewed" | "mine"
type OverdueFilter = "all" | "overdue" | "on-track"
type ReferralAction = "approve" | "reject" | "request-info"
type PendingAction = {
  item: ReferralQueueItem
  action: ReferralAction
}

export function ReferralQueueCard({ title = "Referral queue" }: ReferralQueueCardProps) {
  const [items, setItems] = React.useState<ReferralQueueItem[]>([])
  const [statusFilter, setStatusFilter] = React.useState<"all" | ReferralQueueItem["status"]>("all")
  const [ownerFilter, setOwnerFilter] = React.useState<OwnerFilter>("all")
  const [overdueFilter, setOverdueFilter] = React.useState<OverdueFilter>("all")
  const [actingId, setActingId] = React.useState<string | null>(null)
  const [pendingAction, setPendingAction] = React.useState<PendingAction | null>(null)
  const [actionReason, setActionReason] = React.useState("")
  const [actionNotes, setActionNotes] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const loadQueue = React.useCallback(() => {
    let cancelled = false
    const load = async () => {
      try {
        const nextItems = await getReferralQueue({ status: statusFilter, owner: ownerFilter, overdue: overdueFilter })
        if (!cancelled) {
          setItems(nextItems)
          setError(null)
        }
      } catch {
        if (!cancelled) setError("We couldn't load this section. Try again.")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [statusFilter, ownerFilter, overdueFilter])

  React.useEffect(() => {
    loadQueue()
  }, [loadQueue])

  const retryLoadQueue = () => {
    setIsLoading(true)
    setError(null)
    loadQueue()
  }

  const filteredItems = items

  const startAction = (item: ReferralQueueItem, action: ReferralAction) => {
    setPendingAction({ item, action })
    setActionReason(item.reviewReason ?? "")
    setActionNotes(item.reviewNotes ?? "")
  }

  const runAction = async () => {
    if (!pendingAction) return
    const { item, action } = pendingAction
    try {
      setActingId(item.documentId)
      const updated = await submitReferralAction(item.documentId, action, {
        reason: actionReason,
        notes: actionNotes,
      })
      setItems((prev) => prev.map((row) => (row.documentId === updated.documentId ? updated : row)))
      setPendingAction(null)
      setError(null)
    } catch {
      setError("We couldn't complete that action. Try again.")
    } finally {
      setActingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2 text-xs">
          <select
            aria-label="Filter by status"
            className="rounded border border-border bg-background px-2 py-1"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
          >
            <option value="all">Status: all</option>
            <option value="received">Status: received</option>
            <option value="review_needed">Status: review needed</option>
            <option value="approved">Status: approved</option>
            <option value="rejected">Status: rejected</option>
            <option value="info_requested">Status: info requested</option>
          </select>
          <select
            aria-label="Filter by owner"
            className="rounded border border-border bg-background px-2 py-1"
            value={ownerFilter}
            onChange={(event) => setOwnerFilter(event.target.value as OwnerFilter)}
          >
            <option value="all">Owner: all</option>
            <option value="unreviewed">Owner: unreviewed</option>
            <option value="mine">Owner: mine</option>
          </select>
          <select
            aria-label="Filter by overdue state"
            className="rounded border border-border bg-background px-2 py-1"
            value={overdueFilter}
            onChange={(event) => setOverdueFilter(event.target.value as OverdueFilter)}
          >
            <option value="all">Overdue: all</option>
            <option value="overdue">Overdue: yes</option>
            <option value="on-track">Overdue: no</option>
          </select>
        </div>
        {isLoading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
        {!isLoading && error ? <DashboardStateBlock variant="error" message={error} onRetry={retryLoadQueue} /> : null}
        {!isLoading && !error && filteredItems.length === 0 ? (
          <DashboardStateBlock variant="empty" message="No referrals found for current filters." />
        ) : null}
        {filteredItems.map((item) => (
          <article key={item.documentId} className="space-y-2 rounded-md border border-border/70 p-3 text-xs">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{item.documentId}</p>
              <p className="text-muted-foreground">{item.status}</p>
            </div>
            <p className="text-muted-foreground">patient: {item.patientId} • source: {item.sourceType ?? "n/a"} • overdue: {item.overdue ? "yes" : "no"}</p>
            <p className="text-muted-foreground">
              owner: {item.assignedOwnerUserId ?? "unassigned"} {item.dueAt ? `• due ${item.dueAt}` : ""}
            </p>
            <p className="text-muted-foreground">
              reviewedBy: {item.reviewedBy ?? "n/a"} {item.reviewedAt ? `• ${item.reviewedAt}` : ""}
            </p>
            {item.reviewReason ? <p>Reason: {item.reviewReason}</p> : null}
            {item.reviewNotes ? <p>Notes: {item.reviewNotes}</p> : null}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={actingId === item.documentId}
                onClick={() => startAction(item, "approve")}
                className="rounded border border-border px-2 py-1 hover:bg-muted disabled:opacity-60"
              >
                Approve
              </button>
              <button
                type="button"
                disabled={actingId === item.documentId}
                onClick={() => startAction(item, "reject")}
                className="rounded border border-border px-2 py-1 hover:bg-muted disabled:opacity-60"
              >
                Reject
              </button>
              <button
                type="button"
                disabled={actingId === item.documentId}
                onClick={() => startAction(item, "request-info")}
                className="rounded border border-border px-2 py-1 hover:bg-muted disabled:opacity-60"
              >
                Request info
              </button>
            </div>
          </article>
        ))}
      </CardContent>
      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={`Confirm ${pendingAction?.action === "request-info" ? "Request info" : pendingAction?.action ?? "action"}`}
        description={`Referral: ${pendingAction?.item.documentId ?? ""}`}
        confirmLabel="Confirm action"
        isLoading={Boolean(pendingAction && actingId === pendingAction.item.documentId)}
        variant={pendingAction?.action === "reject" ? "danger" : pendingAction?.action === "approve" ? "success" : "neutral"}
        onCancel={() => setPendingAction(null)}
        onConfirm={() => void runAction()}
      >
        <div className="space-y-2">
          <label className="block text-xs">
            <span className="text-muted-foreground">Reason (optional)</span>
            <input
              value={actionReason}
              onChange={(event) => setActionReason(event.target.value)}
              className="mt-1 w-full rounded border border-border px-2 py-1 text-sm"
            />
          </label>
          <label className="block text-xs">
            <span className="text-muted-foreground">Notes (optional)</span>
            <textarea
              value={actionNotes}
              onChange={(event) => setActionNotes(event.target.value)}
              className="mt-1 w-full rounded border border-border px-2 py-1 text-sm"
              rows={3}
            />
          </label>
        </div>
      </ConfirmDialog>
    </Card>
  )
}
