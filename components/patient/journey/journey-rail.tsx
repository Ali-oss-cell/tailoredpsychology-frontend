"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarPlus,
  CaretDown,
  CaretUp,
  ChatCircle,
  Check,
  Headset,
  MapTrifold,
  Receipt,
} from "@phosphor-icons/react/dist/ssr"
import * as React from "react"

import { JourneyCurrentStepCard } from "@/components/patient/journey/journey-current-step-card"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { PatientNextSession } from "@/src/patient/dashboard/api"
import type { PatientJourneyStep } from "@/src/patient/journey/api"
import {
  contiguousDoneBoundary,
  currentPendingStep,
  deriveHeadline,
  deriveMotivationCopy,
  detailLinkForStep,
  displayStepStatus,
  estimatedNextMilestoneLine,
  formatStepTimestamp,
  guideFor,
  resolveJourneyCta,
  stepVisualState,
  timelineLabelFor,
  formatTimelineDate,
  formatTimelineTime,
  upcomingMilestones,
  visibleSteps,
} from "@/src/patient/journey/step-guide"
import { usePatientJourney } from "@/src/patient/queries/use-patient-journey"
import { usePatientPortalContext } from "@/src/patient/use-patient-portal-context"

type JourneyRailProps = {
  nextSession?: PatientNextSession | null
  sessionLoading?: boolean
  sessionError?: string | null
  onSessionRetry?: () => void
  showInvoiceAction?: boolean
}

function nodeStateClasses(state: ReturnType<typeof stepVisualState>, active: boolean, isCurrent: boolean): string {
  if (state === "done") {
    return cn(
      "h-10 w-10 border-success/50 bg-success/10 text-success",
      active && "scale-105",
    )
  }
  if (state === "current" || isCurrent) {
    return cn(
      "journey-current-pulse border-primary bg-primary text-primary-foreground shadow-primary-glow h-14 w-14",
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

function JourneyQuickActions({ showInvoiceAction }: { showInvoiceAction: boolean }) {
  type QuickAction =
    | { label: string; href: string; icon: typeof Headset }
    | { label: string; event: "clink:open-chat"; icon: typeof ChatCircle }

  const actions: QuickAction[] = [
    { label: "Contact clinic", href: "/contact", icon: Headset },
    { label: "Reschedule", href: "/patient/appointments", icon: CalendarPlus },
    { label: "Message clinician", event: "clink:open-chat", icon: ChatCircle },
    ...(showInvoiceAction
      ? [{ label: "Download invoice", href: "/patient/invoices", icon: Receipt }]
      : []),
  ]

  return (
    <div className="space-y-3" data-tutorial="patient.dashboard.quick-actions">
      <p className="text-foreground text-sm font-medium">Need help?</p>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          const Icon = action.icon
          if ("event" in action) {
            return (
              <Button
                key={action.label}
                type="button"
                variant="outline"
                size="sm"
                className="press gap-1.5"
                onClick={() => window.dispatchEvent(new CustomEvent(action.event))}
              >
                <Icon size={16} />
                {action.label}
              </Button>
            )
          }
          return (
            <Button key={action.label} asChild variant="outline" size="sm" className="press gap-1.5">
              <Link href={action.href}>
                <Icon size={16} />
                {action.label}
              </Link>
            </Button>
          )
        })}
      </div>
    </div>
  )
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

/**
 * Action-oriented care journey — timeline, current step, upcoming milestones, and quick actions.
 */
export function JourneyRail({
  nextSession = null,
  sessionLoading = false,
  sessionError = null,
  onSessionRetry,
  showInvoiceAction = false,
}: JourneyRailProps) {
  const pathname = usePathname()
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
  const compact = portalContext.isFirstTime
  const activeIndex = selectedIndex ?? defaultIndex
  const nodeRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  const currentStep = steps[Math.min(activeIndex, Math.max(steps.length - 1, 0))]
  const motivation = deriveMotivationCopy(steps, portalContext.mode)
  const upcoming = upcomingMilestones(steps)
  const milestoneLine = estimatedNextMilestoneLine(steps, nextSession)
  const ctaContext = React.useMemo(() => ({ pathname, nextSession }), [pathname, nextSession])
  const currentCta =
    currentStep && displayStepStatus(currentStep, steps) === "pending"
      ? resolveJourneyCta(currentStep, ctaContext)
      : null

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

  const { title: summaryTitle, pct } = deriveHeadline(steps)
  const doneCount = contiguousDoneBoundary(steps)

  return (
    <div className="space-y-6" data-tutorial="patient.journey.rail">
      <Card
        id="care-journey"
        className="dashboard-card overflow-hidden rounded-2xl shadow-e1"
      >
        <CardHeader className="border-border/60 space-y-4 border-b bg-muted/15 pb-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h2 className="font-heading text-2xl font-semibold tracking-tight">Your care journey</h2>
              <CardDescription className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
                See where you are, what happens next, and what to do now.
              </CardDescription>
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs sm:text-sm">
              <MapTrifold className="text-primary shrink-0" size={18} aria-hidden />
              <span className="tabular-nums font-medium">
                {journeyQuery.isSuccess ? `${pct}% complete` : "—"} · {doneCount} of {steps.length || "—"} steps
              </span>
            </div>
          </div>

          {journeyQuery.isSuccess && steps.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <p className="text-foreground font-medium">{summaryTitle}</p>
                <p className="text-muted-foreground tabular-nums text-xs">{pct}%</p>
              </div>
              <div
                className="bg-muted h-2 w-full overflow-hidden rounded-full"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Care journey progress"
              >
                <div
                  className="from-primary to-primary/70 h-full rounded-full bg-gradient-to-r transition-[width] duration-500 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
              {milestoneLine ? (
                <p className="text-muted-foreground text-xs leading-relaxed md:text-sm">{milestoneLine}</p>
              ) : null}
              {!compact ? (
                <div className="bg-primary/5 border-primary/15 rounded-xl border px-4 py-3">
                  <p className="text-foreground text-sm font-medium">{motivation.title}</p>
                  <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">{motivation.body}</p>
                </div>
              ) : null}
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

          {journeyQuery.isSuccess && steps.length > 0 ? (
            <>
              {compact && !timelineExpanded ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-muted-foreground text-sm">
                    {nextPending
                      ? `Current: ${guideFor(nextPending.key)?.timelineLabel ?? nextPending.label}`
                      : summaryTitle}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setTimelineExpanded(true)}
                  >
                    View full journey
                    <CaretDown size={14} aria-hidden />
                  </Button>
                </div>
              ) : null}
              {(!compact || timelineExpanded) ? (
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
                          "mt-7 h-0.5 min-w-4 flex-1 rounded-full transition-colors duration-500",
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
                          "flex items-center justify-center rounded-full border-2 transition-all duration-250",
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
            </>
          ) : null}

          {journeyQuery.isSuccess && currentStep && displayStepStatus(currentStep, steps) === "done" ? (
            <CompletedStepDetail
              step={currentStep}
              expanded={expandedDoneKey === currentStep.key}
              onToggle={() =>
                setExpandedDoneKey((key) => (key === currentStep.key ? null : currentStep.key))
              }
            />
          ) : null}

          {journeyQuery.isSuccess &&
          currentStep &&
          displayStepStatus(currentStep, steps) === "pending" &&
          nextPending?.key === currentStep.key ? (
            <div
              id="journey-step-detail"
              role="tabpanel"
              aria-labelledby={`journey-node-${currentStep.key}`}
              className="space-y-3"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="default">In progress</Badge>
                {currentCta ? (
                  <Button asChild size="sm" className="press">
                    <Link href={currentCta.href}>{currentCta.label}</Link>
                  </Button>
                ) : null}
              </div>
              {guideFor(currentStep.key)?.whenPending ? (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {guideFor(currentStep.key)?.whenPending}
                </p>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {!compact ? (
        <JourneyCurrentStepCard
          step={nextPending ?? currentStep ?? null}
          nextSession={nextSession}
          loading={sessionLoading}
          error={sessionError}
          onRetry={onSessionRetry}
        />
      ) : null}

      <Card className="dashboard-card rounded-2xl shadow-e1">
        <CardHeader className="pb-3">
          <h3 className="font-heading text-lg font-semibold">Coming next</h3>
          <CardDescription className="text-sm">
            {upcoming.length > 0
              ? "Upcoming milestones after your current step."
              : "Your session will appear here after booking."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nothing to do right now.</p>
          ) : (
            upcoming.map((step) => {
              const guide = guideFor(step.key)
              return (
                <div
                  key={step.key}
                  className="border-border/70 flex items-start justify-between gap-3 rounded-xl border bg-card p-3"
                >
                  <div className="min-w-0">
                    <p className="text-foreground text-sm font-medium">{guide?.timelineLabel ?? step.label}</p>
                    <p className="text-muted-foreground text-xs">{guide?.upcomingHint ?? "After earlier steps"}</p>
                  </div>
                  <Badge variant="secondary">Upcoming</Badge>
                </div>
              )
            })
          )}
          <JourneyQuickActions showInvoiceAction={showInvoiceAction} />
        </CardContent>
      </Card>
    </div>
  )
}
