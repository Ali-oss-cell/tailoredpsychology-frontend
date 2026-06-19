"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

import { BillingSnapshotCard } from "@/components/patient/dashboard/billing-snapshot-card"
import { PatientDashboardHeroCta, shouldSuppressUpcomingJoin } from "@/components/patient/dashboard/patient-dashboard-hero-cta"
import { PatientDashboardUpcomingSession } from "@/components/patient/dashboard/patient-dashboard-upcoming-session"
import { MoodCheckinCard } from "@/components/patient/dashboard/mood-checkin-card"
import { ResourceRecommendationsCard } from "@/components/patient/dashboard/resource-recommendations-card"
import { PatientTelehealth101Cta } from "@/components/tutorials/patient-telehealth-101-cta"
import { PatientTutorialOnboardingCta } from "@/components/tutorials/patient-tutorial-onboarding-cta"
import { patientDashboardContent } from "@/content/patient-dashboard"
import { getCurrentUser } from "@/src/auth/current-user"
import { listPatientInvoices, type InvoiceSummary } from "@/src/patient/billing/api"
import { getPatientAppointments, type PatientAppointmentSummary } from "@/src/patient/booking/api"
import { pickNextUpcoming } from "@/src/patient/dashboard/join-cta"

export function PatientDashboardView() {
  const [nextSession, setNextSession] = useState<PatientAppointmentSummary | null>(null)
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([])
  const [appointmentsLoading, setAppointmentsLoading] = useState(true)
  const [invoicesLoading, setInvoicesLoading] = useState(true)
  const [appointmentsError, setAppointmentsError] = useState<string | null>(null)
  const [invoicesError, setInvoicesError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setAppointmentsLoading(true)
    setInvoicesLoading(true)
    setAppointmentsError(null)
    setInvoicesError(null)

    try {
      const user = await getCurrentUser()
      if (user.role !== "patient") {
        setNextSession(null)
        setInvoices([])
        return
      }

      const [appointmentsResult, invoicesResult] = await Promise.allSettled([
        getPatientAppointments(user.id),
        listPatientInvoices(),
      ])

      if (appointmentsResult.status === "fulfilled") {
        setNextSession(pickNextUpcoming(appointmentsResult.value.upcoming))
      } else {
        setAppointmentsError("Could not load your next session.")
        setNextSession(null)
      }

      if (invoicesResult.status === "fulfilled") {
        setInvoices(invoicesResult.value)
      } else {
        setInvoicesError("Could not load billing.")
        setInvoices([])
      }
    } catch {
      setAppointmentsError("Could not load your next session.")
      setInvoicesError("Could not load billing.")
      setNextSession(null)
      setInvoices([])
    } finally {
      setAppointmentsLoading(false)
      setInvoicesLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

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
            onRetry={() => void load()}
            suppressJoinButton={suppressJoinButton}
          />
          <ResourceRecommendationsCard items={patientDashboardContent.resources} />
        </div>
        <div className="sticky top-[100px] space-y-4 self-start lg:col-span-1">
          <MoodCheckinCard options={patientDashboardContent.moodOptions} />
          <BillingSnapshotCard invoices={invoices} loading={invoicesLoading} error={invoicesError} />
        </div>
      </div>
    </section>
  )
}
