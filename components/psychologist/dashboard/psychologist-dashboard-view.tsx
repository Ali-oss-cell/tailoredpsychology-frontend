"use client"

import Link from "next/link"
import { CalendarBlank, NotePencil, Stethoscope } from "@phosphor-icons/react/dist/ssr"

import { NextClinicianSessionHero } from "@/components/psychologist/dashboard/next-clinician-session-hero"
import { NotesQueueCard } from "@/components/psychologist/dashboard/notes-queue-card"
import { OpsBentoCard } from "@/components/psychologist/dashboard/ops-bento-card"
import { PreSessionWorkspaceCard } from "@/components/psychologist/dashboard/pre-session-workspace-card"
import { PsychologistDashboardSummaryCards } from "@/components/psychologist/dashboard/psychologist-dashboard-summary-cards"
import { SessionsOverviewCard } from "@/components/psychologist/dashboard/sessions-overview-card"
import { TodayScheduleCard } from "@/components/psychologist/dashboard/today-schedule-card"
import { PsychologistPortalPage } from "@/components/psychologist/psychologist-portal-page"
import { DashboardPageHeader } from "@/components/shared/dashboard-page-header"
import { PortalMetricTile } from "@/components/shared/portal-list-row"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { psychologistDashboardContent } from "@/content/psychologist-dashboard"
import { usePsychologistDashboard } from "@/src/psychologist/queries/use-psychologist-dashboard"

function firstNameOf(displayName: string | undefined): string | null {
  const first = displayName?.trim().split(/\s+/)[0]
  return first && first.length > 0 ? first : null
}

function timeAwareGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function PsychologistDashboardView() {
  const dashboardQuery = usePsychologistDashboard()
  const loading = dashboardQuery.isLoading
  const error = dashboardQuery.isError ? "Could not load your dashboard." : null
  const snapshot = dashboardQuery.data
  const firstName = firstNameOf(snapshot?.user.displayName)
  const greeting = timeAwareGreeting()
  const title = loading
    ? "Loading dashboard…"
    : firstName
      ? `${greeting}, ${firstName}`
      : psychologistDashboardContent.greeting.title

  const handleRetry = () => {
    void dashboardQuery.refetch()
  }

  return (
    <section className="space-y-8 pb-4" data-tutorial="psychologist.page.dashboard">
      <DashboardPageHeader
        title={title}
        description={psychologistDashboardContent.greeting.description}
        eyebrow="Clinician workspace"
      />

      <PsychologistDashboardSummaryCards
        todaySessions={snapshot?.sessions.todayCount ?? null}
        caseloadCount={snapshot?.workspace.itemCount ?? null}
        pendingNotes={snapshot?.notes.pendingCount ?? null}
        loading={loading}
      />

      <div className="dashboard-section">
        <NextClinicianSessionHero
          session={snapshot?.nextSession ?? null}
          loading={loading}
          error={error}
          onRetry={handleRetry}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <SessionsOverviewCard stats={snapshot?.sessions} loading={loading} error={error} onRetry={handleRetry} />
        <Card className="dashboard-card interactive-lift md:col-span-4">
          <CardHeader className="pb-3">
            <p className="card-eyebrow">At a glance</p>
            <CardTitle className="text-2xl">Workspace signals</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <PortalMetricTile label="Prep needed" value={loading ? "—" : (snapshot?.workspace.prepCount ?? 0)} />
            <PortalMetricTile label="Needs attention" value={loading ? "—" : (snapshot?.workspace.attentionCount ?? 0)} />
          </CardContent>
        </Card>
        <OpsBentoCard items={psychologistDashboardContent.operations} />
        <TodayScheduleCard entries={snapshot?.todaySchedule} loading={loading} error={error} onRetry={handleRetry} />
        <NotesQueueCard
          pendingCount={snapshot?.notes.pendingCount}
          signedCount={snapshot?.notes.signedCount}
          loading={loading}
        />
        <Card className="dashboard-card interactive-lift md:col-span-12 lg:col-span-4">
          <CardHeader className="pb-3">
            <p className="card-eyebrow">Quick links</p>
            <CardTitle className="text-2xl">Jump to</CardTitle>
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
