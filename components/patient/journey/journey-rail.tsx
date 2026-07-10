"use client"

import Link from "next/link"
import { Check, MapTrifold } from "@phosphor-icons/react/dist/ssr"
import * as React from "react"

import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { PatientJourneyStep } from "@/src/patient/journey/api"
import {
  ctaForStep,
  deriveHeadline,
  formatStepTimestamp,
  guideFor,
  visibleSteps,
} from "@/src/patient/journey/step-guide"
import { usePatientJourney } from "@/src/patient/queries/use-patient-journey"

/**
 * Journey rail: every milestone is visible at once — done, current, waiting —
 * so patients never lose the map. Selecting a node opens its detail panel;
 * the rail itself never paginates.
 */
export function JourneyRail() {
  const journeyQuery = usePatientJourney()

  const steps = React.useMemo(
    () => visibleSteps(journeyQuery.data?.steps ?? []),
    [journeyQuery.data],
  )

  const firstPendingIndex = steps.findIndex((step) => step.status === "pending")
  const defaultIndex = firstPendingIndex === -1 ? Math.max(steps.length - 1, 0) : firstPendingIndex

  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)
  const activeIndex = selectedIndex ?? defaultIndex
  const nodeRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    let nextIndex: number | null = null
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = Math.min(index + 1, steps.length - 1)
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = Math.max(index - 1, 0)
    if (event.key === "Home") nextIndex = 0
    if (event.key === "End") nextIndex = steps.length - 1
    if (nextIndex === null || nextIndex === index) return
    event.preventDefault()
    setSelectedIndex(nextIndex)
    nodeRefs.current[nextIndex]?.focus()
  }

  const { title: summaryTitle, subtitle: summarySubtitle, pct } = deriveHeadline(steps)
  const doneCount = steps.filter((step) => step.status === "done").length
  const nextPending = steps.find((step) => step.status === "pending")

  const step: PatientJourneyStep | undefined = steps[Math.min(activeIndex, Math.max(steps.length - 1, 0))]
  const guide = step ? guideFor(step.key) : null
  const isDone = step?.status === "done"
  const isCurrent = Boolean(step && nextPending?.key === step.key)
  const cta = step ? ctaForStep(step) : null

  return (
    <Card
      id="care-journey"
      className="dashboard-card interactive-lift overflow-hidden rounded-2xl shadow-e1"
      data-tutorial="patient.journey.rail"
    >
      <CardHeader className="border-border/60 space-y-3 border-b bg-muted/15 pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">Your care journey</h2>
            <CardDescription className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
              Track your progress from intake to invoice. Click any step for details.
            </CardDescription>
          </div>
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs sm:text-sm">
            <MapTrifold className="text-primary shrink-0" size={18} aria-hidden />
            <span className="tabular-nums font-medium">
              {doneCount} of {steps.length || "—"} completed
            </span>
          </div>
        </div>

        {journeyQuery.isSuccess && steps.length > 0 ? (
          <div className="space-y-2 pt-0.5">
            <div className="min-w-0">
              <p className="text-foreground text-sm font-medium leading-snug">{summaryTitle}</p>
              <p className="text-muted-foreground mt-0.5 max-w-xl text-xs leading-relaxed md:text-sm">
                {summarySubtitle}
              </p>
            </div>
            <div
              className="bg-muted h-1.5 w-full overflow-hidden rounded-full"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Milestones recorded"
            >
              <div
                className="from-primary to-primary/70 h-full rounded-full bg-gradient-to-r transition-[width] duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        {journeyQuery.isLoading ? (
          <div className="space-y-4" aria-busy="true" aria-label="Loading journey">
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex shrink-0 flex-col items-center gap-2">
                  <Skeleton className="skeleton-shimmer h-10 w-10 rounded-full" />
                  <Skeleton className="skeleton-shimmer h-3 w-14" />
                </div>
              ))}
            </div>
            <Skeleton className="skeleton-shimmer h-28 w-full rounded-xl" />
          </div>
        ) : null}

        {journeyQuery.isError ? (
          <DashboardStateBlock
            variant="error"
            message="We couldn't load your journey. Try again."
            onRetry={() => void journeyQuery.refetch()}
          />
        ) : null}

        {journeyQuery.isSuccess && steps.length === 0 ? (
          <DashboardStateBlock variant="empty" message="No journey data yet." />
        ) : null}

        {journeyQuery.isSuccess && steps.length > 0 && step ? (
          <>
            <div
              role="tablist"
              aria-label="Journey milestones"
              className="chat-scroll -mx-1 flex snap-x items-start gap-0 overflow-x-auto px-1 pb-1"
            >
              {steps.map((s, index) => {
                const done = s.status === "done"
                const current = nextPending?.key === s.key
                const active = index === activeIndex
                const nodeGuide = guideFor(s.key)
                const NodeIcon = nodeGuide?.icon ?? MapTrifold
                const connectorFilled = index > 0 && steps[index - 1].status === "done"

                return (
                  <React.Fragment key={s.key}>
                    {index > 0 ? (
                      <div
                        aria-hidden
                        className={cn(
                          "mt-5 h-0.5 min-w-4 flex-1 rounded-full transition-colors duration-500",
                          connectorFilled ? "bg-success/60" : "bg-border",
                        )}
                      />
                    ) : null}
                    <button
                      ref={(el) => {
                        nodeRefs.current[index] = el
                      }}
                      type="button"
                      role="tab"
                      id={`journey-node-${s.key}`}
                      aria-selected={active}
                      aria-controls="journey-step-detail"
                      tabIndex={active ? 0 : -1}
                      onClick={() => setSelectedIndex(index)}
                      onKeyDown={(event) => handleKeyDown(event, index)}
                      className={cn(
                        "group flex w-[4.5rem] shrink-0 snap-start flex-col items-center gap-1.5 rounded-lg p-1 text-center",
                        "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2",
                      )}
                    >
                      <span
                        className={cn(
                          "flex items-center justify-center rounded-full border-2 transition-all duration-250",
                          done && "h-10 w-10 border-success/50 bg-success/10 text-success",
                          current && !done && "border-primary bg-primary text-primary-foreground shadow-primary-glow h-12 w-12",
                          !done && !current && "border-border bg-muted/40 text-muted-foreground h-10 w-10",
                          active && !current && "scale-105",
                          active && current && "scale-105",
                        )}
                      >
                        {done ? (
                          <Check size={18} weight="bold" aria-hidden />
                        ) : (
                          <NodeIcon size={18} weight={current ? "fill" : "duotone"} aria-hidden />
                        )}
                      </span>
                      <span
                        className={cn(
                          "text-[11px] leading-tight font-medium",
                          active ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {nodeGuide?.shortLabel ?? s.label}
                      </span>
                      <span className="sr-only">
                        {done ? "recorded" : current ? "in progress" : "waiting"}
                      </span>
                    </button>
                  </React.Fragment>
                )
              })}
            </div>

            <div
              key={step.key}
              id="journey-step-detail"
              role="tabpanel"
              aria-labelledby={`journey-node-${step.key}`}
              className={cn(
                "animate-in fade-in slide-in-from-bottom-2 rounded-xl border p-4 duration-300 md:p-5",
                isCurrent
                  ? "border-primary/35 bg-primary/5 shadow-e1"
                  : isDone
                    ? "border-success/25 bg-success/5"
                    : "border-border/70 bg-card",
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-base font-semibold tracking-tight md:text-lg">{step.label}</h3>
                    {isDone ? (
                      <Badge className="border-success/25 bg-success/15 text-success">Recorded</Badge>
                    ) : isCurrent ? (
                      <Badge variant="default">In progress</Badge>
                    ) : (
                      <Badge variant="secondary">Waiting</Badge>
                    )}
                  </div>
                  {guide?.meaning ? (
                    <p className="text-muted-foreground text-sm leading-relaxed">{guide.meaning}</p>
                  ) : null}
                  <p className="text-foreground text-sm leading-relaxed">
                    <span className="font-medium">{isDone ? "What we logged: " : "What to do: "}</span>
                    {isDone ? (guide?.whenDone ?? "Completed.") : (guide?.whenPending ?? "Complete earlier steps first.")}
                  </p>
                  {formatStepTimestamp(step) ? (
                    <p className="text-muted-foreground text-xs tabular-nums">
                      <span className="text-foreground/80 font-medium">Recorded: </span>
                      {formatStepTimestamp(step)}
                    </p>
                  ) : null}
                </div>
                {cta && isCurrent ? (
                  <Button asChild size="sm" className="press w-full shrink-0 gap-1 sm:w-auto sm:self-center">
                    <Link href={cta.href}>{cta.label}</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
