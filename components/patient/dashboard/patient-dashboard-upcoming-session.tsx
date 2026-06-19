"use client"

import { useCallback, useEffect, useState } from "react"

import { UpcomingSessionCardSkeleton } from "@/components/patient/dashboard/dashboard-skeletons"
import { UpcomingSessionCard } from "@/components/patient/dashboard/upcoming-session-card"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/src/auth/current-user"
import { getPatientAppointments, type PatientAppointmentSummary } from "@/src/patient/booking/api"
import { pickNextUpcoming } from "@/src/patient/dashboard/join-cta"

function formatUpcomingLabels(startIso: string, endIso: string): { dateLabel: string; timeLabel: string } {
  const start = new Date(startIso)
  const end = new Date(endIso)
  const dateLabel = start.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  const timeOpts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" }
  const timeLabel = `${start.toLocaleTimeString(undefined, timeOpts)} - ${end.toLocaleTimeString(undefined, timeOpts)}`
  return { dateLabel, timeLabel }
}

type PatientDashboardUpcomingSessionProps = {
  upcoming?: PatientAppointmentSummary | null
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  suppressJoinButton?: boolean
}

export function PatientDashboardUpcomingSession({
  upcoming: upcomingProp,
  loading: loadingProp,
  error: errorProp,
  onRetry,
  suppressJoinButton = false,
}: PatientDashboardUpcomingSessionProps = {}) {
  const controlled = loadingProp !== undefined

  const [row, setRow] = useState<PatientAppointmentSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const user = await getCurrentUser()
      if (user.role !== "patient") {
        setRow(null)
        return
      }
      const data = await getPatientAppointments(user.id)
      setRow(pickNextUpcoming(data.upcoming))
    } catch {
      setError("Could not load your next session.")
      setRow(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (controlled) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [controlled, load])

  const resolvedLoading = controlled ? loadingProp : loading
  const resolvedError = controlled ? (errorProp ?? null) : error
  const resolvedRow = controlled ? (upcomingProp ?? null) : row
  const handleRetry = onRetry ?? (() => void load())

  if (resolvedLoading) {
    return (
      <Card className="md:col-span-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Upcoming Session</CardTitle>
        </CardHeader>
        <CardContent>
          <UpcomingSessionCardSkeleton />
        </CardContent>
      </Card>
    )
  }

  if (resolvedError) {
    return (
      <Card className="md:col-span-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Upcoming Session</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardStateBlock variant="error" message={resolvedError} onRetry={handleRetry} />
        </CardContent>
      </Card>
    )
  }

  if (!resolvedRow) {
    return (
      <Card className="md:col-span-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Upcoming Session</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardStateBlock variant="empty" message="No upcoming session. Book an appointment to see it here." />
        </CardContent>
      </Card>
    )
  }

  const { dateLabel, timeLabel } = formatUpcomingLabels(resolvedRow.scheduledStartAt, resolvedRow.scheduledEndAt)

  return (
    <UpcomingSessionCard
      appointmentId={resolvedRow.appointmentId}
      sessionType={resolvedRow.sessionTypeLabel}
      clinicianName={resolvedRow.clinicianName}
      dateLabel={dateLabel}
      timeLabel={timeLabel}
      suppressJoinButton={suppressJoinButton}
    />
  )
}
