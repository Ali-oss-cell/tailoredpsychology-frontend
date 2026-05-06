"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

import { AppointmentManagePanel } from "@/components/patient/appointments/appointment-manage-panel"
import { getCurrentUser } from "@/src/auth/current-user"
import { getPatientAppointments, type PatientAppointmentSummary } from "@/src/patient/booking/api"
import { getPatientSessions, getSessionDetail, type SessionDetail } from "@/src/sessions/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { formatSessionRange } from "@/src/patient/appointments/format-session-range"
import { mapAppointmentPhase } from "@/src/patient/appointments/status-phase"
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

function AppointmentsListSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading appointments">
      <div className="border-border/60 bg-muted/40 grid gap-3 rounded-lg border p-3 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)_auto] md:items-center">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-4 w-[60%] max-w-xs" />
          <Skeleton className="h-3 w-2/5 max-w-[10rem]" />
        </div>
        <div className="space-y-2 md:text-right">
          <Skeleton className="h-4 w-24 md:ml-auto" />
          <Skeleton className="h-3 w-20 md:ml-auto" />
        </div>
        <div className="flex flex-wrap gap-2 md:justify-end">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-24 w-full rounded-lg" />
    </div>
  )
}

export function PatientAppointmentsSection() {
  const [upcoming, setUpcoming] = useState<PatientAppointmentSummary[]>([])
  const [past, setPast] = useState<PatientAppointmentSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [manageId, setManageId] = useState<string | null>(null)
  const [sessionDetailById, setSessionDetailById] = useState<Record<string, SessionDetail | null>>({})

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const user = await getCurrentUser()
      if (user.role !== "patient") {
        setError("Sign in as a patient to view appointments.")
        setUpcoming([])
        setPast([])
        return
      }
      const data = await getPatientAppointments(user.id)
      setUpcoming(data.upcoming)
      setPast(data.past)
      const sessions = await getPatientSessions(user.id)
      const details = await Promise.all(sessions.slice(0, 6).map((session) => getSessionDetail(session.sessionId)))
      setSessionDetailById(Object.fromEntries(details.map((detail) => [detail.sessionId, detail])))
    } catch {
      setError("Could not load appointments.")
      setUpcoming([])
      setPast([])
      setSessionDetailById({})
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <AppointmentsListSkeleton />
          ) : error ? (
            <p className="text-destructive text-sm">{error}</p>
          ) : upcoming.length === 0 ? (
            <DashboardStateBlock variant="empty" message="No upcoming appointments." />
          ) : (
            upcoming.map((item) => {
              const { date, time } = formatSessionRange(item.scheduledStartAt, item.scheduledEndAt)
              const phase = mapAppointmentPhase(item, "upcoming")
              return (
                <div key={item.appointmentId}>
                  <div className="border-border/60 bg-muted/40 grid gap-3 rounded-lg border p-3 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)_auto] md:items-center">
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
                          <Link href={joinSessionHref(item.appointmentId)}>Join Telehealth Session</Link>
                        </Button>
                      ) : null}
                      <Button size="sm" variant="outline" onClick={() => setManageId((id) => (id === item.appointmentId ? null : item.appointmentId))}>
                        {manageId === item.appointmentId ? "Close" : "Manage"}
                      </Button>
                      <Badge variant="secondary" className="text-[10px] font-normal">
                        {phase.label}
                      </Badge>
                      <Badge variant={statusBadgeVariant(item.status)}>{item.statusLabel}</Badge>
                    </div>
                  </div>
                  {manageId === item.appointmentId ? (
                    <div className="mt-2">
                      <AppointmentManagePanel appointmentId={item.appointmentId} onAppointmentUpdated={() => void load()} />
                    </div>
                  ) : null}
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="space-y-2" aria-busy="true" aria-label="Loading past sessions">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : past.length === 0 ? (
            <DashboardStateBlock variant="empty" message="No past sessions yet." />
          ) : (
            past.map((row) => {
              const { date } = formatSessionRange(row.scheduledStartAt, row.scheduledEndAt)
              const phase = mapAppointmentPhase(row, "past")
              return (
                <div
                  key={row.appointmentId}
                  className="border-border/40 flex flex-wrap items-center justify-between gap-2 border-b py-2 text-sm last:border-b-0"
                >
                  <span>{date}</span>
                  <span>{row.sessionTypeLabel}</span>
                  <span className="text-muted-foreground">{row.clinicianName}</span>
                  <Badge variant="secondary" className="shrink-0 text-[10px] font-normal">
                    {phase.label}
                  </Badge>
                  <Badge variant={statusBadgeVariant(row.status)} className="shrink-0">
                    {row.statusLabel}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {(sessionDetailById[row.appointmentId]?.viewerAccessMode ?? "owner_patient").replace("_", " ")}
                  </span>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </>
  )
}
