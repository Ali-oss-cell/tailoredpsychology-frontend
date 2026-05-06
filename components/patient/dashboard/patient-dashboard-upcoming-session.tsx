"use client"

import { useCallback, useEffect, useState } from "react"

import { UpcomingSessionCard } from "@/components/patient/dashboard/upcoming-session-card"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/src/auth/current-user"
import { getPatientAppointments, type PatientAppointmentSummary } from "@/src/patient/booking/api"

function pickNextUpcoming(upcoming: PatientAppointmentSummary[]): PatientAppointmentSummary | null {
  if (upcoming.length === 0) return null
  const now = Date.now()
  return upcoming.find((a) => new Date(a.scheduledStartAt).getTime() > now) ?? upcoming[0]
}

function formatUpcomingLabels(startIso: string, endIso: string): { dateLabel: string; timeLabel: string } {
  const start = new Date(startIso)
  const end = new Date(endIso)
  const dateLabel = start.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  const timeOpts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" }
  const timeLabel = `${start.toLocaleTimeString(undefined, timeOpts)} - ${end.toLocaleTimeString(undefined, timeOpts)}`
  return { dateLabel, timeLabel }
}

export function PatientDashboardUpcomingSession() {
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  if (loading) {
    return (
      <Card className="md:col-span-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Upcoming Session</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardStateBlock variant="empty" message="Loading your next session…" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="md:col-span-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Upcoming Session</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardStateBlock variant="error" message={error} onRetry={() => void load()} />
        </CardContent>
      </Card>
    )
  }

  if (!row) {
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

  const { dateLabel, timeLabel } = formatUpcomingLabels(row.scheduledStartAt, row.scheduledEndAt)

  return (
    <UpcomingSessionCard
      appointmentId={row.appointmentId}
      sessionType={row.sessionTypeLabel}
      clinicianName={row.clinicianName}
      dateLabel={dateLabel}
      timeLabel={timeLabel}
    />
  )
}
