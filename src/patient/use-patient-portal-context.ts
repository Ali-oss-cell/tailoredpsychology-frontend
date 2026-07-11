"use client"

import * as React from "react"

import type { PatientDashboardSnapshot } from "@/src/patient/dashboard/api"
import {
  contiguousDoneBoundary,
  currentPendingStep,
  type PatientPortalMode,
  visibleSteps,
} from "@/src/patient/journey/step-guide"
import { usePatientDashboard } from "@/src/patient/queries/use-patient-dashboard"
import { usePatientJourney } from "@/src/patient/queries/use-patient-journey"
import { useCurrentUser } from "@/src/patient/queries/use-current-user"

const RECENT_ACCOUNT_DAYS = 14

export type PatientPortalContext = {
  mode: PatientPortalMode
  isFirstTime: boolean
  isReturning: boolean
  loading: boolean
  hasUpcomingSession: boolean
  hasPastSessions: boolean
  currentStepKey: string | null
  journeyProgress: { done: number; total: number; pct: number } | null
}

function daysSince(iso: string | undefined): number | null {
  if (!iso) return null
  const ms = Date.now() - new Date(iso).getTime()
  if (Number.isNaN(ms)) return null
  return Math.floor(ms / 86_400_000)
}

function deriveMode(input: {
  journeySteps: ReturnType<typeof visibleSteps>
  hasUpcomingSession: boolean
  hasPastSessions: boolean
  accountAgeDays: number | null
  accountSetupComplete: boolean
}): PatientPortalMode {
  const { journeySteps, hasUpcomingSession, hasPastSessions, accountAgeDays, accountSetupComplete } = input
  const doneCount = journeySteps.filter((step) => step.status === "done").length
  const earlyJourney = doneCount <= 2
  const current = currentPendingStep(journeySteps)
  const earlyStepKeys = new Set(["intake_started", "intake_submitted", "booking_requested"])
  const atEarlyStep = current ? earlyStepKeys.has(current.key) : earlyJourney

  if (hasPastSessions || doneCount >= 5) return "returning"
  if (hasUpcomingSession && !atEarlyStep) return "returning"
  if (!accountSetupComplete || atEarlyStep) return "first-time"
  if (accountAgeDays !== null && accountAgeDays <= RECENT_ACCOUNT_DAYS && earlyJourney) return "first-time"
  if (earlyJourney && !hasUpcomingSession) return "first-time"
  return "returning"
}

export function buildPatientPortalContext(input: {
  dashboard?: PatientDashboardSnapshot | null
  journeySteps?: ReturnType<typeof visibleSteps>
  userUpdatedAt?: string
  accountSetupComplete?: boolean
  loading?: boolean
}): PatientPortalContext {
  const journeySteps = input.journeySteps ?? visibleSteps(input.dashboard?.journey.steps ?? [])
  const done = contiguousDoneBoundary(journeySteps)
  const total = journeySteps.length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const hasUpcomingSession = Boolean(input.dashboard?.nextSession)
  const hasPastSessions = journeySteps.some(
    (step) => (step.key === "session_completed" || step.key === "session_started") && step.status === "done",
  )
  const current = currentPendingStep(journeySteps)

  const mode = deriveMode({
    journeySteps,
    hasUpcomingSession,
    hasPastSessions,
    accountAgeDays: daysSince(input.userUpdatedAt),
    accountSetupComplete: input.accountSetupComplete !== false,
  })

  return {
    mode,
    isFirstTime: mode === "first-time",
    isReturning: mode === "returning",
    loading: input.loading ?? false,
    hasUpcomingSession,
    hasPastSessions,
    currentStepKey: current?.key ?? null,
    journeyProgress: total > 0 ? { done, total, pct } : null,
  }
}

export function usePatientPortalContext(): PatientPortalContext {
  const dashboardQuery = usePatientDashboard()
  const journeyQuery = usePatientJourney()
  const userQuery = useCurrentUser()

  const journeySteps = React.useMemo(
    () => visibleSteps(journeyQuery.data?.steps ?? dashboardQuery.data?.journey.steps ?? []),
    [journeyQuery.data, dashboardQuery.data],
  )

  return React.useMemo(
    () =>
      buildPatientPortalContext({
        dashboard: dashboardQuery.data,
        journeySteps,
        userUpdatedAt: userQuery.data?.updatedAt,
        accountSetupComplete: userQuery.data?.accountSetupComplete,
        loading: dashboardQuery.isLoading || journeyQuery.isLoading || userQuery.isLoading,
      }),
    [
      dashboardQuery.data,
      dashboardQuery.isLoading,
      journeyQuery.isLoading,
      journeySteps,
      userQuery.data?.accountSetupComplete,
      userQuery.data?.updatedAt,
      userQuery.isLoading,
    ],
  )
}
