"use client"

import * as React from "react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { EmptyState } from "@/components/shared/empty-state"
import { PortalFormField, PortalSelect } from "@/components/shared/portal-form-field"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/src/lib/toast"
import {
  assignIntakeQueueItem,
  getAssignableClinicians,
  getIntakeQueue,
  type AssignableClinician,
  type IntakeQueueItem,
} from "@/src/ops/queue/api"

export function IntakeQueueCard() {
  const [items, setItems] = React.useState<IntakeQueueItem[]>([])
  const [clinicians, setClinicians] = React.useState<AssignableClinician[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [activeAssignItemId, setActiveAssignItemId] = React.useState<string | null>(null)
  const [selectedClinicianByItem, setSelectedClinicianByItem] = React.useState<Record<string, string>>({})
  const [isAssigningByItem, setIsAssigningByItem] = React.useState<Record<string, boolean>>({})

  const loadQueue = React.useCallback(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [next, nextClinicians] = await Promise.all([getIntakeQueue(), getAssignableClinicians()])
        if (!cancelled) {
          setItems(next)
          setClinicians(nextClinicians)
          setError(null)
        }
      } catch {
        if (!cancelled) {
          setError("We couldn't load this section. Try again.")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])
  React.useEffect(() => {
    loadQueue()
  }, [loadQueue])

  const retryLoadQueue = () => {
    setIsLoading(true)
    setError(null)
    loadQueue()
  }

  const assign = async (queueItemId: string) => {
    const selectedClinicianId = selectedClinicianByItem[queueItemId]
    if (!selectedClinicianId) {
      const message = "Select a clinician before assigning."
      setError(message)
      toast.error(message)
      return
    }
    try {
      setIsAssigningByItem((prev) => ({ ...prev, [queueItemId]: true }))
      const updated = await assignIntakeQueueItem(queueItemId, selectedClinicianId)
      setItems((prev) => prev.map((item) => (item.queueItemId === updated.queueItemId ? updated : item)))
      setActiveAssignItemId(null)
      setError(null)
      toast.success("Clinician assigned.")
    } catch {
      const message = "We couldn't complete that action. Try again."
      setError(message)
      toast.error(message)
    } finally {
      setIsAssigningByItem((prev) => ({ ...prev, [queueItemId]: false }))
    }
  }

  const resolveDefaultClinicianId = (item: IntakeQueueItem): string => {
    const assignedExists = clinicians.some((candidate) => candidate.clinicianId === item.assignedClinicianId)
    if (assignedExists && item.assignedClinicianId) {
      return item.assignedClinicianId
    }
    return clinicians[0]?.clinicianId ?? ""
  }

  const renderAssignedLabel = (item: IntakeQueueItem): string => {
    if (!item.assignedClinicianId) return "unassigned"
    const clinician = clinicians.find((candidate) => candidate.clinicianId === item.assignedClinicianId)
    if (!clinician) return item.assignedClinicianId
    return `${clinician.displayName} (${clinician.clinicianId})`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intake triage queue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
        {!isLoading && error ? (
          <DashboardStateBlock variant="error" message={error} onRetry={retryLoadQueue} />
        ) : null}
        {!isLoading && !error && items.length === 0 ? (
          <EmptyState title="No intake items yet." description="New booking requests will appear here for triage." />
        ) : null}
        {items.slice(0, 8).map((item) => (
          <article key={item.queueItemId} className="rounded-md border border-border/70 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{item.queueItemId}</p>
              <button
                type="button"
                onClick={() => {
                  setError(null)
                  setActiveAssignItemId((prev) => (prev === item.queueItemId ? null : item.queueItemId))
                  setSelectedClinicianByItem((prev) => ({
                    ...prev,
                    [item.queueItemId]:
                      prev[item.queueItemId] && clinicians.some((candidate) => candidate.clinicianId === prev[item.queueItemId])
                        ? prev[item.queueItemId]
                        : resolveDefaultClinicianId(item),
                  }))
                }}
                className="rounded border border-border px-2 py-1 text-xs hover:bg-muted"
              >
                Assign
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              state: {item.state} • risk: {item.risk} • referral: {item.referralStatus}
            </p>
            <p className="text-xs text-muted-foreground">assigned: {renderAssignedLabel(item)}</p>
            {activeAssignItemId === item.queueItemId ? (
              <div className="mt-2 rounded-md border border-border/70 p-2">
                <p className="text-xs font-medium">Assign clinician</p>
                {clinicians.length === 0 ? <p className="mt-1 text-xs text-muted-foreground">No active clinicians available.</p> : null}
                <div className="mt-2 flex items-center gap-2">
                  <PortalFormField id={`assign-clinician-${item.queueItemId}`} label="Clinician" className="min-w-0 flex-1 space-y-1">
                    <PortalSelect
                      className="text-xs"
                      value={selectedClinicianByItem[item.queueItemId] ?? ""}
                      disabled={clinicians.length === 0}
                      onChange={(event) =>
                        setSelectedClinicianByItem((prev) => ({ ...prev, [item.queueItemId]: event.target.value }))
                      }
                    >
                      {clinicians.map((clinician) => (
                        <option key={clinician.clinicianId} value={clinician.clinicianId}>
                          {clinician.displayName}
                        </option>
                      ))}
                    </PortalSelect>
                  </PortalFormField>
                  <button
                    type="button"
                    onClick={() => void assign(item.queueItemId)}
                    disabled={isAssigningByItem[item.queueItemId] || clinicians.length === 0}
                    className="rounded border border-border px-2 py-1 text-xs hover:bg-muted disabled:opacity-60"
                  >
                    {isAssigningByItem[item.queueItemId] ? "Saving..." : "Confirm"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAssignItemId(null)}
                    className="rounded border border-border px-2 py-1 text-xs hover:bg-muted"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </CardContent>
    </Card>
  )
}
