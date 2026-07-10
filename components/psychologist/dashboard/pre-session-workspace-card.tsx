"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/src/auth/current-user"
import { formatRelativeTimestamp } from "@/src/shared/relative-time"
import { getPsychologistWorkspace, type PsychologistWorkspaceItem } from "@/src/psychologist/workspace/api"
import { joinSessionHref } from "@/src/session/join-session"

export function PreSessionWorkspaceCard() {
  const [readinessFilter, setReadinessFilter] = React.useState<"all" | "ready" | "attention" | "unknown">("all")
  const [staleOnly, setStaleOnly] = React.useState(false)
  const [sortBy, setSortBy] = React.useState<"startsAt" | "readinessUpdatedAt" | "readinessStatus">("startsAt")
  const [prepOnly, setPrepOnly] = React.useState(false)

  const workspaceQuery = useQuery({
    queryKey: ["psychologist-workspace", readinessFilter, staleOnly, sortBy],
    queryFn: async () => {
      const user = await getCurrentUser()
      const workspace = await getPsychologistWorkspace(user.id, {
        readinessStatus: readinessFilter === "all" ? undefined : readinessFilter,
        staleMinutes: staleOnly ? 15 : undefined,
        sortBy,
        sortOrder: "asc",
      })
      return workspace.items
    },
    refetchInterval: () =>
      typeof document !== "undefined" && document.visibilityState === "visible" ? 90_000 : false,
  })

  const items = workspaceQuery.data ?? []
  const isLoading = workspaceQuery.isPending
  const error = workspaceQuery.isError ? "We couldn't load this section. Try again." : null
  const lastRefreshedAt = workspaceQuery.dataUpdatedAt

  const retryLoadWorkspace = () => {
    void workspaceQuery.refetch()
  }

  const readinessBadgeClass = (status: PsychologistWorkspaceItem["readinessStatus"]) => {
    if (status === "ready") {
      return "rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success"
    }
    if (status === "attention") {
      return "rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[11px] font-medium text-warning"
    }
    return "rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700"
  }

  const prepCount = items.filter((item) => item.actions.length > 0).length
  const displayedItems = prepOnly ? items.filter((item) => item.actions.length > 0) : items
  const lastRefreshedLabel = lastRefreshedAt
    ? new Date(lastRefreshedAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" })
    : null

  return (
    <Card className="interactive-lift md:col-span-12">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="card-eyebrow">Preparation</p>
            <CardTitle>Pre-session workspace</CardTitle>
            <CardDescription>
              Upcoming sessions requiring preparation
              {!isLoading && !error && prepCount > 0 ? ` · ${prepCount} with open prep items` : ""}
              {lastRefreshedLabel ? ` · Updated ${lastRefreshedLabel}` : ""}
            </CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => retryLoadWorkspace()}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="h-8 rounded-md border border-border bg-background px-2 text-xs"
            value={readinessFilter}
            onChange={(event) =>
              setReadinessFilter(event.target.value as "all" | "ready" | "attention" | "unknown")
            }
          >
            <option value="all">All readiness</option>
            <option value="attention">Attention</option>
            <option value="unknown">Unknown</option>
            <option value="ready">Ready</option>
          </select>
          <select
            className="h-8 rounded-md border border-border bg-background px-2 text-xs"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as "startsAt" | "readinessUpdatedAt" | "readinessStatus")
            }
          >
            <option value="startsAt">Sort: Start time</option>
            <option value="readinessStatus">Sort: Readiness priority</option>
            <option value="readinessUpdatedAt">Sort: Last check age</option>
          </select>
          <label className="flex items-center gap-1 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={staleOnly}
              onChange={(event) => setStaleOnly(event.target.checked)}
              className="h-3.5 w-3.5"
            />
            Stale checks (&gt;15m)
          </label>
          <label className="flex items-center gap-1 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={prepOnly}
              onChange={(event) => setPrepOnly(event.target.checked)}
              className="h-3.5 w-3.5"
            />
            Prep items only
          </label>
        </div>
        {isLoading ? <DashboardStateBlock variant="loading" message="Loading data..." /> : null}
        {!isLoading && error ? <DashboardStateBlock variant="error" message={error} onRetry={retryLoadWorkspace} /> : null}
        {!isLoading && !error && displayedItems.length === 0 ? (
          <EmptyState
            title={prepOnly ? "No items with open prep tasks." : "No upcoming prep items."}
            description="Sessions needing preparation will appear here as appointments are scheduled."
          />
        ) : null}
        {!isLoading && !error && displayedItems.length > 0 ? (
          <div className="space-y-2">
            {displayedItems.map((item) => (
              <article key={item.appointmentId} className="rounded-md border border-border/60 p-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{item.patientId}</p>
                  <span className={readinessBadgeClass(item.readinessStatus)}>{item.readinessStatus}</span>
                </div>
                <p className="text-muted-foreground">{new Date(item.startsAt).toLocaleString()}</p>
                {item.readinessUpdatedAt ? (
                  <p className="text-muted-foreground" title={new Date(item.readinessUpdatedAt).toLocaleString()}>
                    Last checked: {formatRelativeTimestamp(item.readinessUpdatedAt)}
                  </p>
                ) : null}
                <p>Risk: {item.risk}</p>
                <p>Referral: {item.referralStatus}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline" className="h-7 px-2 text-[11px]">
                    <Link href={`/psychologist/patients/${encodeURIComponent(item.patientId)}`}>Open patient</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="h-7 px-2 text-[11px]">
                    <Link href={joinSessionHref(item.appointmentId)}>Open session</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
