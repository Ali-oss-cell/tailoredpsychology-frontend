"use client"

import { BillingSnapshotCard } from "@/components/patient/dashboard/billing-snapshot-card"
import { DashboardSummaryCards } from "@/components/patient/dashboard/dashboard-summary-cards"
import { DashboardWelcomeSection } from "@/components/patient/dashboard/dashboard-welcome-section"
import { FirstTimeDashboardHero } from "@/components/patient/dashboard/first-time-dashboard-hero"
import { QuickActionsCard } from "@/components/patient/dashboard/quick-actions-card"
import { ResourceRecommendationsCard } from "@/components/patient/dashboard/resource-recommendations-card"
import { JourneyRail } from "@/components/patient/journey/journey-rail"
import { PatientTelehealth101Cta } from "@/components/tutorials/patient-telehealth-101-cta"
import { PatientTutorialOnboardingCta } from "@/components/tutorials/patient-tutorial-onboarding-cta"
import { patientDashboardContent } from "@/content/patient-dashboard"
import { isJourneyComplete, visibleSteps } from "@/src/patient/journey/step-guide"
import { usePatientDashboard } from "@/src/patient/queries/use-patient-dashboard"
import { usePatientJourney } from "@/src/patient/queries/use-patient-journey"
import { useNotificationUnreadCount } from "@/src/patient/queries/use-notification-unread-count"
import { usePatientPortalContext } from "@/src/patient/use-patient-portal-context"

function firstNameOf(displayName: string | undefined): string | null {
  const first = displayName?.trim().split(/\s+/)[0]
  return first && first.length > 0 ? first : null
}

function billingStatusLabel(unpaidCount: number, latestStatus: string | undefined): string {
  if (unpaidCount > 0) return `${unpaidCount} to pay`
  if (latestStatus?.toLowerCase() === "paid") return "Up to date"
  if (latestStatus) return latestStatus
  return "Up to date"
}

export function PatientDashboardView() {
  const dashboardQuery = usePatientDashboard()
  const journeyQuery = usePatientJourney()
  const notificationsQuery = useNotificationUnreadCount()
  const portalContext = usePatientPortalContext()

  const loading = dashboardQuery.isLoading
  const error = dashboardQuery.isError ? "Could not load your dashboard." : null
  const snapshot = dashboardQuery.data

  const handleRetry = () => {
    void Promise.all([dashboardQuery.refetch(), journeyQuery.refetch(), notificationsQuery.refetch()])
  }

  const firstName = firstNameOf(snapshot?.user.displayName)
  const journeySteps = visibleSteps(journeyQuery.data?.steps ?? [])
  const journeyDone = portalContext.journeyProgress?.done ?? 0
  const journeyTotal = portalContext.journeyProgress?.total ?? journeySteps.length
  const journeyPct = portalContext.journeyProgress?.pct ?? 0
  const hideJourneyRail = journeyQuery.isSuccess && isJourneyComplete(journeyQuery.data?.steps ?? [])
  const nextSession = snapshot?.nextSession ?? null
  const unpaidCount = snapshot?.billing.unpaidCount ?? 0

  const showSummaryPills = !portalContext.isFirstTime && hideJourneyRail
  const showBillingSnapshot = unpaidCount > 0

  const billingStatus = snapshot
    ? billingStatusLabel(unpaidCount, snapshot.billing.latestInvoice?.status)
    : null

  return (
    <section className="space-y-4 pb-4" data-tutorial="patient.page.dashboard">
      <DashboardWelcomeSection firstName={firstName} loading={loading} />

      {portalContext.isFirstTime ? <FirstTimeDashboardHero loading={loading} /> : null}

      {!portalContext.isFirstTime && !hideJourneyRail ? (
        <JourneyRail
          nextSession={nextSession}
          sessionLoading={loading}
          sessionError={error}
          onSessionRetry={handleRetry}
        />
      ) : null}

      {!portalContext.isFirstTime && hideJourneyRail && journeyQuery.isSuccess && journeyTotal > 0 ? (
        <p className="text-muted-foreground text-sm">
          Care journey complete — new bookings or sessions will update your progress.
        </p>
      ) : null}

      {showSummaryPills ? (
        <DashboardSummaryCards
          careProgress={
            journeyQuery.isSuccess && journeyTotal > 0
              ? { done: journeyDone, total: journeyTotal, pct: journeyPct }
              : null
          }
          unreadMessages={notificationsQuery.isSuccess ? notificationsQuery.data : null}
          documentCount={patientDashboardContent.resources.length}
          billingStatus={billingStatus}
          loading={loading || journeyQuery.isLoading}
        />
      ) : null}

      <QuickActionsCard actions={patientDashboardContent.quickActions} />

      {portalContext.isFirstTime ? (
        <div className="space-y-3">
          <PatientTutorialOnboardingCta />
          <PatientTelehealth101Cta />
        </div>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ResourceRecommendationsCard items={patientDashboardContent.resources} />
        {showBillingSnapshot ? (
          <div className="lg:sticky lg:top-24 lg:self-start">
            <BillingSnapshotCard
              latestInvoice={snapshot?.billing.latestInvoice ?? null}
              unpaidCount={unpaidCount}
              loading={loading}
              error={error}
              onRetry={handleRetry}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
