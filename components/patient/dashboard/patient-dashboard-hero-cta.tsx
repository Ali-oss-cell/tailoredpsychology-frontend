"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import type { PatientAppointmentSummary } from "@/src/patient/booking/api"
import { isJoinImminent, shouldShowBookHero } from "@/src/patient/dashboard/join-cta"
import { joinSessionHref } from "@/src/session/join-session"

type PatientDashboardHeroCtaProps = {
  nextSession: PatientAppointmentSummary | null
  loading?: boolean
}

export function PatientDashboardHeroCta({ nextSession, loading = false }: PatientDashboardHeroCtaProps) {
  if (loading) {
    return null
  }

  if (isJoinImminent(nextSession)) {
    return (
      <div data-tutorial="patient.dashboard.hero-join">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href={joinSessionHref(nextSession!.appointmentId)}>Join Video Session</Link>
        </Button>
      </div>
    )
  }

  if (shouldShowBookHero(nextSession)) {
    return (
      <div data-tutorial="patient.dashboard.hero-book">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/patient/book-appointment">Book New Session</Link>
        </Button>
      </div>
    )
  }

  return null
}

/** Whether the upcoming session card should hide its join button (hero handles it). */
export function shouldSuppressUpcomingJoin(nextSession: PatientAppointmentSummary | null): boolean {
  return isJoinImminent(nextSession)
}
