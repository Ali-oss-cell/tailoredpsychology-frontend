"use client"

import type { PatientNextSession } from "@/src/patient/dashboard/api"
import type { PatientJourneyStep } from "@/src/patient/journey/api"

import { JourneyCurrentStepCard } from "@/components/patient/journey/journey-current-step-card"

type NextSessionHeroProps = {
  session: PatientNextSession | null
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  /** Optional journey step context when used outside JourneyRail. */
  step?: PatientJourneyStep | null
}

/** @deprecated Use JourneyCurrentStepCard inside JourneyRail on the dashboard. */
export function NextSessionHero({ session, loading = false, error = null, onRetry, step = null }: NextSessionHeroProps) {
  return (
    <JourneyCurrentStepCard
      step={step}
      nextSession={session}
      loading={loading}
      error={error}
      onRetry={onRetry}
    />
  )
}
