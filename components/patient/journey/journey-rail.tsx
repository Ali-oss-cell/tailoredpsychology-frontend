"use client"

import Link from "next/link"
import {
  CaretDown,
  CaretUp,
  Check,
  MapTrifold,
} from "@phosphor-icons/react/dist/ssr"
import * as React from "react"

import { JourneyCurrentStepCard } from "@/components/patient/journey/journey-current-step-card"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { PatientNextSession } from "@/src/patient/dashboard/api"
import type { PatientJourneyStep } from "@/src/patient/journey/api"
import {
  contiguousDoneBoundary,
  currentPendingStep,
  detailLinkForStep,
  displayStepStatus,
  formatStepTimestamp,
  guideFor,
  stepVisualState,
  timelineLabelFor,
  formatTimelineDate,
  formatTimelineTime,
  visibleSteps,
} from "@/src/patient/journey/step-guide"
import { usePatientJourney } from "@/src/patient/queries/use-patient-journey"
import { usePatientPortalContext } from "@/src/patient/use-patient-portal-context"

type JourneyRailProps = {
  nextSession?: PatientNextSession | null
  sessionLoading?: boolean
  sessionError?: string | null
  onSessionRetry?: () => void
}

function nodeStateClasses(state: ReturnType<typeof stepVisualState>, active: boolean, isCurrent: boolean): string {
  if (state === "done") {
    return cn("h-10 w-10 border-success/50 bg-success/10 text-success", active && "scale-105")
  }
  if (state === "current" || isCurrent) {
    return cn(
      "border-primary bg-primary text-primary-foreground shadow-primary-glow h-14 w-14",
      active && "scale-105",
    )
  }
  if (state === "problem") {
    return "h-10 w-10 border-destructive/50 bg-destructive/10 text-destructive"
  }
  if (state === "waiting") {
    return "h-10 w-10 border-warning/50 bg-warning/10 text-warning"
  }
  return cn("border-border bg-muted/40 text-muted-foreground h-10 w-10", active && "scale-105")
}

function CompletedStepDetail({
  step,
  expanded,
  onToggle,
}: {
  step: PatientJourneyStep
  expanded: boolean
  onToggle: () => void
}) {
  const guide = guideFor(step.key)
  const detailLink = detailLinkForStep(step.key)

  return (
    <div className="border-success/20 bg-success/5 rounded-xl border p-3">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 text-left"
        aria-expanded={expanded}
      >
        <div className="min-w-0">
          <p className="text-foreground text-sm font-medium">{guide?.timelineLabel ?? step.label}</p>
          {formatStepTimestamp(step) ? (
            <p className="text-muted-foreground text-xs tabular-nums">{formatStepTimestamp(step)}</p>
          ) : null}
        </div>
        {expanded ? <CaretUp size={16} /> : <CaretDown size={16} />}
      </button>
      {expanded ? (
        <div className="mt-3 space-y-2">
          <p className="text-muted-foreground text-sm leading-relaxed">{guide?.whenDone}</p>
          {detailLink ? (
            <Link href={detailLink.href} className="text-primary text-sm font-medium underline-offset-2 hover:underline">
              {detailLink.label}
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function compactStatusLine(
  steps: PatientJourneyStep[],
  nextPending: PatientJourneyStep | undefined,
): string {
  const doneCount = contiguousDoneBoundary(steps)
  const total = steps.length
  const currentIndex = nextPending ? steps.findIndex((step) => step.key === nextPending.key) : doneCount
  const stepNumber = Math.min(currentIndex + 1, total)
  const label = nextPending
    ? guideFor(nextPending.key)?.shortLabel ?? nextPending.label
    : "Complete"
  return `Step ${stepNumber} of ${total} · ${label}`
}

/**
 * Action-oriented care journey — current step first, full timeline optional.
 */
export function JourneyRail({
  nextSession = null,
  sessionLoading = false,
  sessionError = null,
  onSessionRetry,
}: JourneyRailProps) {
  const portalContext = usePatientPortalContext()
  const journeyQuery = usePatientJourney()

  const steps = React.useMemo(
    () => visibleSteps(journeyQuery.data?.steps ?? []),
    [journeyQuery.data],
  )

  const nextPending = currentPendingStep(steps)
  const firstPendingIndex = nextPending ? steps.findIndex((step) => step.key === nextPending.key) : -1
  const defaultIndex = firstPendingIndex === -1 ? Math.max(steps.length - 1, 0) : firstPendingIndex

  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)
  const [expandedDoneKey, setExpandedDoneKey] = React.useState<string | null>(null)
  const [timelineExpanded, setTimelineExpanded] = React.useState(false)
  const showCurrentStepCard = !portalContext.isFirstTime
  const activeIndex = selectedIndex ?? defaultIndex
  const nodeRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  const currentStep = steps[Math.min(activeIndex, Math.max(steps.length - 1, 0))]

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

  return (
    <div className="space-y-3" data-tutorial="patient.journey.rail">
      {showCurrentStepCard ? (
        <JourneyCurrentStepCard
          step={nextPending ?? currentStep ?? null}
          nextSession={nextSession}
          loading={sessionLoading || journeyQuery.isLoading}
          error={sessionError}
          onRetry={onSessionRetry}
        />
      ) : null}

      <Card id="care-journey" className="dashboard-card overflow-hidden rounded-2xl shadow-e1">
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 px-4 py-3">
          <div className="min-w-0">
            <h2 className="font-heading text-base font-semibold tracking-tight">Care journey</h2>
            {journeyQuery.isSuccess && steps.length > 0 ? (
              <p className="text-muted-foreground truncate text-xs">{compactStatusLine(steps, nextPending)}</p>
            ) : null}
          </div>
          {journeyQuery.isSuccess && steps.length > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 gap-1 rounded-full"
              aria-expanded={timelineExpanded}
              onClick={() => setTimelineExpanded((open) => !open)}
            >
              {timelineExpanded ? "Hide" : "All steps"}
              {timelineExpanded ? <CaretUp size={14} aria-hidden /> : <CaretDown size={14} aria-hidden />}
            </Button>
          ) : null}
        </CardHeader>

        <CardContent className="space-y-3 px-4 pb-4 pt-0">
          {journeyQuery.isLoading ? (
            <div className="space-y-3" aria-busy="true" aria-label="Loading journey">
              <Skeleton className="skeleton-shimmer h-4 w-48" />
              <Skeleton className="skeleton-shimmer h-10 w-full" />
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

          {journeyQuery.isSuccess && steps.length > 0 && timelineExpanded ? (
            <div
              role="tablist"
              aria-label="Journey milestones"
              className="chat-scroll -mx-1 flex snap-x items-start gap-0 overflow-x-auto px-1 pb-1"
            >
              {steps.map((step, index) => {
                const isCurrent = nextPending?.key === step.key
                const active = index === activeIndex
                const visualState = stepVisualState(step, isCurrent, steps)
                const displayStatus = displayStepStatus(step, steps)
                const nodeGuide = guideFor(step.key)
                const NodeIcon = nodeGuide?.icon ?? MapTrifold
                const connectorFilled = index > 0 && displayStepStatus(steps[index - 1], steps) === "done"
                const dateLabel = formatTimelineDate(step, isCurrent, nextSession)
                const timeLabel = formatTimelineTime(step, isCurrent, nextSession)

                return (
                  <React.Fragment key={step.key}>
                    {index > 0 ? (
                      <div
                        aria-hidden
                        className={cn(
                          "mt-7 h-0.5 min-w-4 flex-1 rounded-full",
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
                      id={`journey-node-${step.key}`}
                      aria-selected={active}
                      aria-controls="journey-step-detail"
                      tabIndex={active ? 0 : -1}
                      onClick={() => setSelectedIndex(index)}
                      onKeyDown={(event) => handleKeyDown(event, index)}
                      className={cn(
                        "group flex w-[5.5rem] shrink-0 snap-start flex-col items-center gap-1.5 rounded-lg p-1 text-center",
                        "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2",
                      )}
                    >
                      <span
                        className={cn(
                          "flex items-center justify-center rounded-full border-2",
                          nodeStateClasses(visualState, active, isCurrent),
                        )}
                      >
                        {displayStatus === "done" ? (
                          <Check size={isCurrent ? 20 : 18} weight="bold" aria-hidden />
                        ) : (
                          <NodeIcon size={isCurrent ? 22 : 18} weight={isCurrent ? "fill" : "duotone"} aria-hidden />
                        )}
                      </span>
                      <span
                        className={cn(
                          "text-[11px] leading-tight font-medium",
                          isCurrent || active ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {timelineLabelFor(step, isCurrent, nextSession)}
                      </span>
                      {dateLabel ? (
                        <span className="text-muted-foreground text-[10px] leading-tight tabular-nums">{dateLabel}</span>
                      ) : null}
                      {timeLabel ? (
                        <span className="text-muted-foreground text-[10px] leading-tight tabular-nums">{timeLabel}</span>
                      ) : null}
                      <span className="sr-only">
                        {displayStatus === "done" ? "completed" : isCurrent ? "current step" : "upcoming"}
                      </span>
                    </button>
                  </React.Fragment>
                )
              })}
            </div>
          ) : null}

          {journeyQuery.isSuccess && timelineExpanded && currentStep && displayStepStatus(currentStep, steps) === "done" ? (
            <CompletedStepDetail
              step={currentStep}
              expanded={expandedDoneKey === currentStep.key}
              onToggle={() =>
                setExpandedDoneKey((key) => (key === currentStep.key ? null : currentStep.key))
              }
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
