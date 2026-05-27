"use client"

import * as React from "react"

import { getCurrentUser } from "@/src/auth/current-user"
import { getPatientAppointments } from "@/src/patient/booking/api"

export type PatientBookingEligibility = {
  loading: boolean
  /** No prior visits on record — first-time booking path only. */
  isNewPatient: boolean
  /** Has at least one past appointment (any status) on file. */
  canBookFollowUp: boolean
  pastAppointmentCount: number
  upcomingAppointmentCount: number
  displayName: string
  email: string
}

const defaultState: PatientBookingEligibility = {
  loading: true,
  isNewPatient: true,
  canBookFollowUp: false,
  pastAppointmentCount: 0,
  upcomingAppointmentCount: 0,
  displayName: "",
  email: "",
}

/**
 * Determines whether the patient should see follow-up booking or only initial intake.
 * Based on appointment history from the API, not local draft state.
 */
export function usePatientBookingEligibility(patientId: string | null): PatientBookingEligibility {
  const [state, setState] = React.useState<PatientBookingEligibility>(defaultState)

  React.useEffect(() => {
    if (!patientId) {
      return
    }
    let cancelled = false
    void (async () => {
      try {
        const [user, appointments] = await Promise.all([
          getCurrentUser(),
          getPatientAppointments(patientId).catch(() => ({ upcoming: [], past: [] })),
        ])
        if (cancelled) return
        const pastCount = appointments.past?.length ?? 0
        const upcomingCount = appointments.upcoming?.length ?? 0
        const canBookFollowUp = pastCount > 0
        setState({
          loading: false,
          isNewPatient: !canBookFollowUp,
          canBookFollowUp,
          pastAppointmentCount: pastCount,
          upcomingAppointmentCount: upcomingCount,
          displayName: user.displayName ?? "",
          email: user.email ?? "",
        })
      } catch {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, isNewPatient: true, canBookFollowUp: false }))
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [patientId])

  return state
}
