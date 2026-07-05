"use client"

import * as React from "react"
import Link from "next/link"

import { ClinicianPublicProfileHeader } from "@/components/shared/clinician-public-profile-header"
import { DashboardStateBlock } from "@/components/shared/dashboard-state-block"
import { PortalListRow } from "@/components/shared/portal-list-row"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { patientMyClinicianContent } from "@/content/patient-my-clinician"
import { getCurrentUser } from "@/src/auth/current-user"
import { getPatientAppointments, type PatientAppointmentSummary } from "@/src/patient/booking/api"
import { getMyCareTeam, type PatientCareClinician } from "@/src/patient/care-team/api"
import { formatSessionRange } from "@/src/patient/appointments/format-session-range"
import { mapAppointmentPhase } from "@/src/patient/appointments/status-phase"

function formatSummaryWhen(iso: string | undefined): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function statusBadgeVariant(
  status: PatientAppointmentSummary["status"],
): "default" | "secondary" | "outline" {
  if (status === "cancelled" || status === "no_show") return "secondary"
  if (status === "completed") return "secondary"
  if (status === "in_progress") return "default"
  return "outline"
}

function CareTeamLoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2" aria-busy="true" aria-label="Loading care team">
      {[0, 1].map((key) => (
        <Card key={key} className="border-border/70">
          <CardHeader className="pb-2">
            <div className="flex gap-3">
              <Skeleton className="h-16 w-16 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-3/5 max-w-[14rem]" />
                <Skeleton className="h-3 w-full max-w-xs" />
                <Skeleton className="h-3 w-4/5 max-w-sm" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-9 w-40 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function appointmentsForClinician(
  lists: { upcoming: PatientAppointmentSummary[]; past: PatientAppointmentSummary[] } | null,
  clinicianId: string,
): { upcoming: PatientAppointmentSummary[]; past: PatientAppointmentSummary[] } {
  if (!lists) return { upcoming: [], past: [] }
  return {
    upcoming: lists.upcoming.filter((a) => a.clinicianId === clinicianId),
    past: lists.past.filter((a) => a.clinicianId === clinicianId),
  }
}

export function PatientMyClinicianSection() {
  const [team, setTeam] = React.useState<PatientCareClinician[]>([])
  const [appointmentLists, setAppointmentLists] = React.useState<{
    upcoming: PatientAppointmentSummary[]
    past: PatientAppointmentSummary[]
  } | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [appointmentsError, setAppointmentsError] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const user = await getCurrentUser()
      if (user.role !== "patient") {
        setError("Sign in as a patient to view your clinician.")
        setTeam([])
        setAppointmentLists(null)
        return
      }
      const [rows, appts] = await Promise.all([
        getMyCareTeam(),
        getPatientAppointments(user.id).catch(() => null),
      ])
      setTeam(rows)
      if (appts) {
        setAppointmentLists(appts)
        setAppointmentsError(null)
      } else {
        setAppointmentLists(null)
        setAppointmentsError(patientMyClinicianContent.appointmentsUnavailable)
      }
    } catch {
      setError("We could not load your care team. Try again later.")
      setAppointmentLists(null)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void load()
  }, [load])

  return (
    <>
      <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">{patientMyClinicianContent.emergencyNotice}</p>

      {appointmentsError ? <DashboardStateBlock variant="empty" message={appointmentsError} /> : null}

      <div role="status" aria-live="polite" aria-busy={loading}>
        {loading ? <CareTeamLoadingSkeleton /> : null}
        {error ? <DashboardStateBlock variant="error" message={error} onRetry={() => void load()} /> : null}
        {!loading && !error && team.length === 0 ? (
          <DashboardStateBlock variant="empty" message={patientMyClinicianContent.emptyTeam} />
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {!loading && !error
          ? team.map((clinician) => {
              const { upcoming, past } = appointmentsForClinician(appointmentLists, clinician.clinicianId)
              const specialtyLine =
                clinician.specialties.length > 0 ? `Focus areas: ${clinician.specialties.join(", ")}` : undefined

              return (
                <Card key={clinician.clinicianId} className="interactive-lift border-border/70">
                  <CardHeader className="pb-2">
                    <p className="card-eyebrow">Clinician</p>
                    <ClinicianPublicProfileHeader
                      density="care"
                      name={clinician.displayName}
                      bio={clinician.bio}
                      profileImageUrl={clinician.profileImageUrl}
                      specialtyLine={specialtyLine}
                      titleRowEnd={
                        <Badge variant={clinician.accountStatus === "active" ? "default" : "secondary"}>
                          {clinician.accountStatus}
                        </Badge>
                      }
                    />
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="space-y-1 border-border/50 border-t pt-3">
                      {clinician.registrationNumber ? (
                        <p>
                          <span className="text-muted-foreground">AHPRA registration: </span>
                          {clinician.registrationNumber}
                        </p>
                      ) : null}
                      {clinician.providerNumber ? (
                        <p>
                          <span className="text-muted-foreground">Provider number: </span>
                          {clinician.providerNumber}
                        </p>
                      ) : null}
                    </div>

                    {appointmentLists ? (
                      <>
                        <div className="space-y-2">
                          <p className="text-foreground font-medium">Upcoming</p>
                          {upcoming.length === 0 ? (
                            <p className="text-muted-foreground text-xs">
                              No upcoming appointments with this clinician.
                              {clinician.nextSessionAt ? (
                                <> Next from schedule: {formatSummaryWhen(clinician.nextSessionAt)}.</>
                              ) : null}
                            </p>
                          ) : (
                            upcoming.map((item) => {
                              const { date, time } = formatSessionRange(item.scheduledStartAt, item.scheduledEndAt)
                              const phase = mapAppointmentPhase(item, "upcoming")
                              return (
                                <PortalListRow key={item.appointmentId} className="md:grid-cols-[minmax(0,1fr)_auto]">
                                  <div>
                                    <p className="font-medium">{item.sessionTypeLabel}</p>
                                    <p className="text-muted-foreground text-xs">{date}</p>
                                    <p className="text-muted-foreground text-xs">{time}</p>
                                  </div>
                                  <div className="flex flex-wrap gap-1 self-center">
                                    <Badge variant="secondary" className="text-[10px] font-normal">
                                      {phase.label}
                                    </Badge>
                                    <Badge variant={statusBadgeVariant(item.status)} className="text-[10px]">
                                      {item.statusLabel}
                                    </Badge>
                                  </div>
                                </PortalListRow>
                              )
                            })
                          )}
                        </div>

                        <div className="space-y-2">
                          <p className="text-foreground font-medium">Recent sessions</p>
                          {past.length === 0 ? (
                            <p className="text-muted-foreground text-xs">No past sessions in your history yet.</p>
                          ) : (
                            past.slice(0, 5).map((item) => {
                              const { date } = formatSessionRange(item.scheduledStartAt, item.scheduledEndAt)
                              const phase = mapAppointmentPhase(item, "past")
                              return (
                                <PortalListRow
                                  key={item.appointmentId}
                                  className="md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                                >
                                  <p className="text-xs">{date}</p>
                                  <p className="text-xs">{item.sessionTypeLabel}</p>
                                  <div className="flex flex-wrap gap-1">
                                    <Badge variant="secondary" className="text-[10px] font-normal">
                                      {phase.label}
                                    </Badge>
                                    <Badge variant={statusBadgeVariant(item.status)} className="text-[10px]">
                                      {item.statusLabel}
                                    </Badge>
                                  </div>
                                </PortalListRow>
                              )
                            })
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1 border-border/50 border-t pt-2">
                        <p>
                          <span className="text-muted-foreground">Next session: </span>
                          {formatSummaryWhen(clinician.nextSessionAt)}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Last in history: </span>
                          {formatSummaryWhen(clinician.lastSessionAt)}
                        </p>
                      </div>
                    )}

                    <p className="text-muted-foreground pt-1 text-xs leading-relaxed">
                      This view is built from your booking and appointment history. When you book again, routing stays
                      aligned with your existing care relationship.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button variant="default" size="sm" asChild>
                        <Link href={`/patient/book-appointment?clinician=${encodeURIComponent(clinician.clinicianId)}`}>
                          {patientMyClinicianContent.bookWithClinician}
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/patient/appointments">{patientMyClinicianContent.viewAppointments}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          : null}
      </div>
    </>
  )
}
