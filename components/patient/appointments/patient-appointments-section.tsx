"use client"

import Link from "next/link"
import { useState } from "react"

import { AppointmentManagePanel } from "@/components/patient/appointments/appointment-manage-panel"
import type { PatientAppointmentSummary } from "@/src/patient/booking/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PortalListRow } from "@/components/shared/portal-list-row"
import { formatSessionRange } from "@/src/patient/appointments/format-session-range"
import { mapAppointmentPhase } from "@/src/patient/appointments/status-phase"
import { useCurrentUser } from "@/src/patient/queries/use-current-user"
import { usePatientAppointments } from "@/src/patient/queries/use-patient-appointments"
import { usePatientAppointmentSessionDetails } from "@/src/patient/queries/use-patient-appointment-session-details"
import { joinSessionHref } from "@/src/session/join-session"

function showJoinTelehealth(item: PatientAppointmentSummary): boolean {
  if (item.status === "cancelled" || item.status === "no_show") return false
  return true
}

function statusBadgeVariant(
  status: PatientAppointmentSummary["status"],
): "default" | "secondary" | "outline" {
  if (status === "cancelled" || status === "no_show") return "secondary"
  if (status === "completed") return "secondary"
  if (status === "in_progress") return "default"
  return "outline"
}

export function PatientAppointmentsSection() {
  const userQuery = useCurrentUser()
  const appointmentsQuery = usePatientAppointments()
  const sessionDetailsQuery = usePatientAppointmentSessionDetails()
  const [manageId, setManageId] = useState<string | null>(null)

  const isPatient = userQuery.data?.role === "patient"
  const loading =
    userQuery.isLoading ||
    (isPatient && (appointmentsQuery.isLoading || sessionDetailsQuery.isLoading))

  const error = (() => {
    if (userQuery.isSuccess && userQuery.data.role !== "patient") {
      return "Sign in as a patient to view appointments."
    }
    if (userQuery.isError || appointmentsQuery.isError || sessionDetailsQuery.isError) {
      return "Could not load appointments."
    }
    return null
  })()

  const upcoming = appointmentsQuery.data?.upcoming ?? []
  const past = appointmentsQuery.data?.past ?? []
  const sessionDetailById = sessionDetailsQuery.data ?? {}

  const refreshAppointments = () => {
    void Promise.all([appointmentsQuery.refetch(), sessionDetailsQuery.refetch()])
  }

  return (
    <>
      <Card className="interactive-lift">
        <CardHeader className="pb-3">
          <p className="card-eyebrow">Schedule</p>
          <CardTitle className="text-lg">Upcoming appointments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? <DashboardStateBlock variant="loading" message="Loading appointments..." /> : null}
          {!loading && error ? (
            <DashboardStateBlock variant="error" message={error} onRetry={refreshAppointments} />
          ) : null}
          {!loading && !error && upcoming.length === 0 ? (
            <DashboardStateBlock variant="empty" message="No upcoming appointments." />
          ) : null}
          {!loading && !error
            ? upcoming.map((item) => {
                const { date, time } = formatSessionRange(item.scheduledStartAt, item.scheduledEndAt)
                const phase = mapAppointmentPhase(item, "upcoming")
                return (
                  <div key={item.appointmentId}>
                    <PortalListRow className="md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_auto]">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{item.sessionTypeLabel}</p>
                        <p className="text-muted-foreground text-xs">{item.clinicianName}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-sm">{date}</p>
                        <p className="text-muted-foreground text-xs">{time}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 md:justify-end">
                        {showJoinTelehealth(item) ? (
                          <Button size="sm" asChild>
                            <Link href={joinSessionHref(item.appointmentId)}>Join session</Link>
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setManageId((id) => (id === item.appointmentId ? null : item.appointmentId))}
                        >
                          {manageId === item.appointmentId ? "Close" : "Manage"}
                        </Button>
                        <Badge variant="secondary" className="text-[10px] font-normal">
                          {phase.label}
                        </Badge>
                        <Badge variant={statusBadgeVariant(item.status)}>{item.statusLabel}</Badge>
                      </div>
                    </PortalListRow>
                    {manageId === item.appointmentId ? (
                      <div className="mt-2">
                        <AppointmentManagePanel
                          appointmentId={item.appointmentId}
                          onAppointmentUpdated={refreshAppointments}
                        />
                      </div>
                    ) : null}
                  </div>
                )
              })
            : null}
        </CardContent>
      </Card>

      <Card className="interactive-lift">
        <CardHeader className="pb-3">
          <p className="card-eyebrow">History</p>
          <CardTitle className="text-lg">Recent sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? <DashboardStateBlock variant="loading" message="Loading session history..." /> : null}
          {!loading && !error && past.length === 0 ? (
            <DashboardStateBlock variant="empty" message="No past sessions yet." />
          ) : null}
          {!loading && !error
            ? past.map((row) => {
                const { date } = formatSessionRange(row.scheduledStartAt, row.scheduledEndAt)
                const phase = mapAppointmentPhase(row, "past")
                return (
                  <PortalListRow
                    key={row.appointmentId}
                    className="md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto]"
                  >
                    <p className="text-sm">{date}</p>
                    <div>
                      <p className="text-sm font-medium">{row.sessionTypeLabel}</p>
                      <p className="text-muted-foreground text-xs">{row.clinicianName}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-[10px] font-normal">
                        {phase.label}
                      </Badge>
                      <Badge variant={statusBadgeVariant(row.status)}>{row.statusLabel}</Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {(sessionDetailById[row.appointmentId]?.viewerAccessMode ?? "owner_patient").replace("_", " ")}
                    </p>
                  </PortalListRow>
                )
              })
            : null}
        </CardContent>
      </Card>
    </>
  )
}
