"use client"

import Link from "next/link"
import { CalendarBlank, NotePencil, Stethoscope } from "@phosphor-icons/react/dist/ssr"

import { NextClinicianSessionHero } from "@/components/psychologist/dashboard/next-clinician-session-hero"
import { NotesQueueCard } from "@/components/psychologist/dashboard/notes-queue-card"
import { OpsBentoCard } from "@/components/psychologist/dashboard/ops-bento-card"
import { PreSessionWorkspaceCard } from "@/components/psychologist/dashboard/pre-session-workspace-card"
import { SessionsOverviewCard } from "@/components/psychologist/dashboard/sessions-overview-card"
import { TodayScheduleCard } from "@/components/psychologist/dashboard/today-schedule-card"
import { PortalMetricTile } from "@/components/shared/portal-list-row"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { psychologistDashboardContent } from "@/content/psychologist-dashboard"
import { usePsychologistDashboard } from "@/src/psychologist/queries/use-psychologist-dashboard"

function firstNameOf(displayName: string | undefined): string | null {
  const first = displayName?.trim().split(/\s+/)[0]
  return first && first.length > 0 ? first : null
}

export function PsychologistDashboardView() {
  const dashboardQuery = usePsychologistDashboard()
  const loading = dashboardQuery.isLoading
  const error = dashboardQuery.isError ? "Could not load your dashboard." : null
  const snapshot = dashboardQuery.data
  const firstName = firstNameOf(snapshot?.user.displayName)

  const handleRetry = () => {
    void dashboardQuery.refetch()
  }

  return (
    <section className="space-y-8" data-tutorial="psychologist.page.dashboard">
      <header className="space-y-2">
        <p className="card-eyebrow">Clinician workspace</p>
        {loading ? (
          <Skeleton className="skeleton-shimmer h-9 w-56" aria-label="Loading greeting" />
        ) : (
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            {firstName ? `Hello, ${firstName}` : psychologistDashboardContent.greeting.title}
          </h1>
        )}
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed md:text-base">
          {psychologistDashboardContent.greeting.description}
        </p>
      </header>

      <NextClinicianSessionHero
        session={snapshot?.nextSession ?? null}
        loading={loading}
        error={error}
        onRetry={handleRetry}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <SessionsOverviewCard
          stats={snapshot?.sessions}
          loading={loading}
          error={error}
          onRetry={handleRetry}
        />
        <Card className="interactive-lift md:col-span-4">
          <CardHeader className="pb-3">
            <p className="card-eyebrow">At a glance</p>
            <CardTitle className="text-lg">Workspace signals</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <PortalMetricTile label="Prep needed" value={loading ? "—" : (snapshot?.workspace.prepCount ?? 0)} />
            <PortalMetricTile label="Needs attention" value={loading ? "—" : (snapshot?.workspace.attentionCount ?? 0)} />
          </CardContent>
        </Card>
        <OpsBentoCard items={psychologistDashboardContent.operations} />
        <TodayScheduleCard
          entries={snapshot?.todaySchedule}
          loading={loading}
          error={error}
          onRetry={handleRetry}
        />
        <NotesQueueCard
          pendingCount={snapshot?.notes.pendingCount}
          signedCount={snapshot?.notes.signedCount}
          loading={loading}
        />
        <Card className="interactive-lift md:col-span-12 lg:col-span-4">
          <CardHeader className="pb-3">
            <p className="card-eyebrow">Quick links</p>
            <CardTitle className="text-lg">Jump to</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/psychologist/patients"
              className="hover:bg-muted/70 flex items-center gap-3 rounded-xl border border-border/50 p-3 transition-colors"
            >
              <Stethoscope size={18} className="text-primary" />
              <span className="text-sm font-medium">Patient caseload</span>
            </Link>
            <Link
              href="/psychologist/notes"
              className="hover:bg-muted/70 flex items-center gap-3 rounded-xl border border-border/50 p-3 transition-colors"
            >
              <NotePencil size={18} className="text-primary" />
              <span className="text-sm font-medium">Notes queue</span>
            </Link>
            <Link
              href="/psychologist/schedule"
              className="hover:bg-muted/70 flex items-center gap-3 rounded-xl border border-border/50 p-3 transition-colors"
            >
              <CalendarBlank size={18} className="text-primary" />
              <span className="text-sm font-medium">Today&apos;s schedule</span>
            </Link>
          </CardContent>
        </Card>
        <div className="md:col-span-12 lg:col-span-8">
          <PreSessionWorkspaceCard />
        </div>
      </div>
    </section>
  )
}
