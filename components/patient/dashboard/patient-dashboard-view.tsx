"use client"

import Link from "next/link"

import { BillingSnapshotCard } from "@/components/patient/dashboard/billing-snapshot-card"
import { PatientDashboardHeroCta, shouldSuppressUpcomingJoin } from "@/components/patient/dashboard/patient-dashboard-hero-cta"
import { PatientDashboardUpcomingSession } from "@/components/patient/dashboard/patient-dashboard-upcoming-session"
import { MoodCheckinCard } from "@/components/patient/dashboard/mood-checkin-card"
import { ResourceRecommendationsCard } from "@/components/patient/dashboard/resource-recommendations-card"
import { PatientTelehealth101Cta } from "@/components/tutorials/patient-telehealth-101-cta"
import { PatientTutorialOnboardingCta } from "@/components/tutorials/patient-tutorial-onboarding-cta"
import { patientDashboardContent } from "@/content/patient-dashboard"
import { pickNextUpcoming } from "@/src/patient/dashboard/join-cta"
import { useCurrentUser } from "@/src/patient/queries/use-current-user"
import { usePatientAppointments } from "@/src/patient/queries/use-patient-appointments"
import { usePatientInvoices } from "@/src/patient/queries/use-patient-invoices"

export function PatientDashboardView() {
  const userQuery = useCurrentUser()
  const appointmentsQuery = usePatientAppointments()
  const invoicesQuery = usePatientInvoices()

  const isPatient = userQuery.data?.role === "patient"
  const appointmentsLoading = userQuery.isLoading || (isPatient && appointmentsQuery.isLoading)
  const invoicesLoading = userQuery.isLoading || (isPatient && invoicesQuery.isLoading)

  const nextSession = appointmentsQuery.data ? pickNextUpcoming(appointmentsQuery.data.upcoming) : null
  const appointmentsError =
    userQuery.isError || appointmentsQuery.isError ? "Could not load your next session." : null
  const invoicesError = userQuery.isError || invoicesQuery.isError ? "Could not load billing." : null

  const handleRetry = () => {
    void Promise.all([userQuery.refetch(), appointmentsQuery.refetch(), invoicesQuery.refetch()])
  }

  const suppressJoinButton = shouldSuppressUpcomingJoin(nextSession)

  return (
    <section className="space-y-6" data-tutorial="patient.page.dashboard">
      <header className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          {patientDashboardContent.greeting.title}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
          {patientDashboardContent.greeting.description}
        </p>
      </header>

      <PatientTutorialOnboardingCta />

      <PatientTelehealth101Cta />

      <p className="text-muted-foreground text-sm">
        <span data-tutorial="patient.dashboard.video-setup-link">
          <Link href="/patient/video-setup" className="text-primary font-medium underline-offset-2 hover:underline">
            Test camera & microphone
          </Link>
        </span>{" "}
        before a video visit.
      </p>

      <PatientDashboardHeroCta nextSession={nextSession} loading={appointmentsLoading} />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <PatientDashboardUpcomingSession
            upcoming={nextSession}
            loading={appointmentsLoading}
            error={appointmentsError}
            onRetry={handleRetry}
            suppressJoinButton={suppressJoinButton}
          />
          <ResourceRecommendationsCard items={patientDashboardContent.resources} />
        </div>
        <div className="sticky top-[100px] space-y-4 self-start lg:col-span-1">
          <MoodCheckinCard options={patientDashboardContent.moodOptions} />
          <BillingSnapshotCard
            invoices={invoicesQuery.data ?? []}
            loading={invoicesLoading}
            error={invoicesError}
          />
        </div>
      </div>
    </section>
  )
}
