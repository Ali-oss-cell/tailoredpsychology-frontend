"use client"

import { BillingSnapshotCard } from "@/components/patient/dashboard/billing-snapshot-card"
import { NextSessionHero } from "@/components/patient/dashboard/next-session-hero"
import { ResourceRecommendationsCard } from "@/components/patient/dashboard/resource-recommendations-card"
import { JourneyRail } from "@/components/patient/journey/journey-rail"
import { PatientTelehealth101Cta } from "@/components/tutorials/patient-telehealth-101-cta"
import { PatientTutorialOnboardingCta } from "@/components/tutorials/patient-tutorial-onboarding-cta"
import { Skeleton } from "@/components/ui/skeleton"
import { patientDashboardContent } from "@/content/patient-dashboard"
import { isJourneyComplete } from "@/src/patient/journey/step-guide"
import { useCurrentUser } from "@/src/patient/queries/use-current-user"
import { usePatientDashboard } from "@/src/patient/queries/use-patient-dashboard"
import { usePatientJourney } from "@/src/patient/queries/use-patient-journey"

function firstNameOf(displayName: string | undefined): string | null {
  const first = displayName?.trim().split(/\s+/)[0]
  return first && first.length > 0 ? first : null
}

export function PatientDashboardView() {
  const userQuery = useCurrentUser()
  const dashboardQuery = usePatientDashboard()
  const journeyQuery = usePatientJourney()

  const isPatient = userQuery.data?.role === "patient"
  const loading = userQuery.isLoading || (isPatient && dashboardQuery.isLoading)
  const error = userQuery.isError || dashboardQuery.isError ? "Could not load your dashboard." : null
  const snapshot = dashboardQuery.data

  const handleRetry = () => {
    void Promise.all([userQuery.refetch(), dashboardQuery.refetch()])
  }

  const firstName = firstNameOf(snapshot?.user.displayName)
  const hideJourneyRail =
    journeyQuery.isSuccess && isJourneyComplete(journeyQuery.data?.steps ?? [])

  return (
    <section className="space-y-8" data-tutorial="patient.page.dashboard">
      <header className="space-y-2">
        <p className="card-eyebrow">Your dashboard</p>
        {loading ? (
          <Skeleton className="skeleton-shimmer h-9 w-56" aria-label="Loading greeting" />
        ) : (
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            {firstName ? `Hello, ${firstName}` : "Hello"}
          </h1>
        )}
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed md:text-base">
          {patientDashboardContent.greeting.description}
        </p>
      </header>

      <PatientTutorialOnboardingCta />
      <PatientTelehealth101Cta />

      {!hideJourneyRail ? <JourneyRail /> : null}

      <NextSessionHero
        session={snapshot?.nextSession ?? null}
        loading={loading}
        error={error}
        onRetry={handleRetry}
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ResourceRecommendationsCard items={patientDashboardContent.resources} />
        <div className="lg:sticky lg:top-6 lg:self-start">
          <BillingSnapshotCard
            latestInvoice={snapshot?.billing.latestInvoice ?? null}
            unpaidCount={snapshot?.billing.unpaidCount ?? 0}
            loading={loading}
            error={error}
            onRetry={handleRetry}
          />
        </div>
      </div>
    </section>
  )
}
